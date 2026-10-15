from django.test import override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from .models import Topic, Product

@override_settings(REQUIRE_ADMIN_MFA=False, SECURE_SSL_REDIRECT=False, ALLOWED_HOSTS=['testserver'])
class ProductSetOptionsTests(APITestCase):
    def setUp(self):
        self.staff = get_user_model().objects.create_user('admin-staff', password='admin-password', is_staff=True)
        self.token = Token.objects.create(user=self.staff)
        self.topic = Topic.objects.create(title='Keychains', icon='Key', desc='Keychains desc', is_active=True)

    def test_create_product_with_set_options(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        payload = {
            'product_id': 'set-test-1',
            'topic': self.topic.id,
            'name': 'Flexi Dragon',
            'price': 199,
            'desc': 'Articulated 3D printed dragon',
            'has_sets': True,
            'set_options': [
                {'name': 'Set of 2', 'quantity': 2, 'price': 349},
                {'name': 'Set of 4', 'quantity': 4, 'price': 649}
            ],
            'is_active': True
        }
        res = self.client.post('/api/products/', payload, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertTrue(res.data['has_sets'])
        self.assertEqual(len(res.data['set_options']), 2)
        self.assertEqual(res.data['set_options'][0]['name'], 'Set of 2')
        self.assertEqual(res.data['set_options'][0]['price'], 349)

    def test_public_endpoint_exposes_set_options(self):
        product = Product.objects.create(
            topic=self.topic,
            product_id='set-test-2',
            name='Voronoi Lamp',
            price=499,
            has_sets=True,
            set_options=[
                {'name': 'Pair of 2', 'quantity': 2, 'price': 899}
            ],
            is_active=True
        )

        res = self.client.get(f'/api/products/{product.id}/')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data['has_sets'])
        self.assertEqual(len(res.data['set_options']), 1)
        self.assertEqual(res.data['set_options'][0]['name'], 'Pair of 2')
        self.assertEqual(res.data['set_options'][0]['price'], 899)

    def test_default_product_has_sets_false(self):
        product = Product.objects.create(
            topic=self.topic,
            product_id='no-sets-1',
            name='Simple Planter',
            price=99,
            is_active=True
        )
        self.assertFalse(product.has_sets)
        self.assertEqual(product.set_options, [])

        res = self.client.get(f'/api/products/{product.id}/')
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.data['has_sets'])
        self.assertEqual(res.data['set_options'], [])

    def test_validation_rejects_negative_price_in_set_options(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        payload = {
            'product_id': 'invalid-set',
            'topic': self.topic.id,
            'name': 'Invalid Product',
            'price': 100,
            'has_sets': True,
            'set_options': [
                {'name': 'Bad Set', 'quantity': 2, 'price': -50}
            ],
            'is_active': True
        }
        res = self.client.post('/api/products/', payload, format='json')
        self.assertEqual(res.status_code, 400)
        self.assertIn('set_options', res.data)
