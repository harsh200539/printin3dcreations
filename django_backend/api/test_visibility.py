from django.test import override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from .models import Topic, Product

@override_settings(REQUIRE_ADMIN_MFA=False, SECURE_SSL_REDIRECT=False, ALLOWED_HOSTS=['testserver'])
class VisibilityAndBlockingTests(APITestCase):
    def setUp(self):
        self.staff = get_user_model().objects.create_user('admin-staff', password='admin-password', is_staff=True)
        self.token = Token.objects.create(user=self.staff)

        # Create 2 categories: Category 1 (active), Category 2 (hidden)
        self.topic1 = Topic.objects.create(title='Keychains', icon='Key', desc='Keychains desc', is_active=True)
        self.topic2 = Topic.objects.create(title='Secret Category', icon='Palette', desc='Secret desc', is_active=False)

        # Products under Category 1
        self.prod1_active = Product.objects.create(
            topic=self.topic1, product_id='1-1', name='Active Keychain', price=100, desc='Active', is_active=True
        )
        self.prod1_hidden = Product.objects.create(
            topic=self.topic1, product_id='1-2', name='Hidden Keychain', price=150, desc='Hidden', is_active=False
        )

        # Product under Category 2 (even though is_active=True, its category is hidden!)
        self.prod2_category_hidden = Product.objects.create(
            topic=self.topic2, product_id='2-1', name='Hidden Cat Product', price=200, desc='In hidden category', is_active=True
        )

    def test_public_cannot_see_hidden_category_or_its_products(self):
        # 1. Topics endpoint for public
        res_topics = self.client.get('/api/topics/')
        self.assertEqual(res_topics.status_code, 200)
        topic_ids = [t['id'] for t in res_topics.data]
        self.assertIn(self.topic1.id, topic_ids)
        self.assertNotIn(self.topic2.id, topic_ids)

        # 2. Products endpoint for public
        res_products = self.client.get('/api/products/')
        self.assertEqual(res_products.status_code, 200)
        prod_ids = [p['product_id'] for p in res_products.data]
        self.assertIn('1-1', prod_ids)
        self.assertNotIn('1-2', prod_ids) # hidden product
        self.assertNotIn('2-1', prod_ids) # product in hidden category

    def test_public_direct_detail_access_returns_404_for_hidden_items(self):
        # Direct access to hidden product returns 404
        res_prod_hidden = self.client.get(f'/api/products/{self.prod1_hidden.id}/')
        self.assertEqual(res_prod_hidden.status_code, 404)

        # Direct access to product in hidden category returns 404
        res_prod_cat_hidden = self.client.get(f'/api/products/{self.prod2_category_hidden.id}/')
        self.assertEqual(res_prod_cat_hidden.status_code, 404)

        # Direct access to hidden category returns 404
        res_topic_hidden = self.client.get(f'/api/topics/{self.topic2.id}/')
        self.assertEqual(res_topic_hidden.status_code, 404)

        # Direct access to active product returns 200
        res_prod_active = self.client.get(f'/api/products/{self.prod1_active.id}/')
        self.assertEqual(res_prod_active.status_code, 200)

    def test_staff_can_view_all_and_toggle_visibility(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Staff gets all categories
        res_topics = self.client.get('/api/topics/')
        self.assertEqual(res_topics.status_code, 200)
        topic_ids = [t['id'] for t in res_topics.data]
        self.assertIn(self.topic1.id, topic_ids)
        self.assertIn(self.topic2.id, topic_ids)

        # Staff can toggle category to active
        res_patch_topic = self.client.patch(f'/api/topics/{self.topic2.id}/', {'is_active': True}, format='json')
        self.assertEqual(res_patch_topic.status_code, 200)
        self.topic2.refresh_from_db()
        self.assertTrue(self.topic2.is_active)

        # Staff can toggle product to hidden
        res_patch_prod = self.client.patch(f'/api/products/{self.prod1_active.id}/', {'is_active': False}, format='json')
        self.assertEqual(res_patch_prod.status_code, 200)
        self.prod1_active.refresh_from_db()
        self.assertFalse(self.prod1_active.is_active)

    def test_all_flag_returns_paused_items_without_deleting_and_allows_reactivation(self):
        # ?all=true returns all topics and products so admin studio never loses them
        res_topics = self.client.get('/api/topics/?all=true')
        self.assertEqual(res_topics.status_code, 200)
        topic_ids = [t['id'] for t in res_topics.data]
        self.assertIn(self.topic1.id, topic_ids)
        self.assertIn(self.topic2.id, topic_ids) # paused category is preserved!

        res_products = self.client.get('/api/products/?all=true')
        self.assertEqual(res_products.status_code, 200)
        prod_ids = [p['product_id'] for p in res_products.data]
        self.assertIn('1-1', prod_ids)
        self.assertIn('1-2', prod_ids) # paused product is preserved!
        self.assertIn('2-1', prod_ids)

        # Staff can activate the paused product back
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        res_reactivate = self.client.patch(f'/api/products/{self.prod1_hidden.id}/', {'is_active': True}, format='json')
        self.assertEqual(res_reactivate.status_code, 200)
        self.prod1_hidden.refresh_from_db()
        self.assertTrue(self.prod1_hidden.is_active)

        # Now public user can see it again without ?all=true!
        self.client.credentials() # clear auth
        res_public_after = self.client.get('/api/products/')
        prod_ids_after = [p['product_id'] for p in res_public_after.data]
        self.assertIn('1-2', prod_ids_after)

