from django.db import models

class Topic(models.Model):
    title = models.CharField(max_length=255)
    icon = models.CharField(max_length=100) # e.g. "Key", "Palette", "Gamepad2"
    desc = models.TextField()
    details = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=500, blank=True, null=True)
    is_active = models.BooleanField(default=True, db_index=True, help_text="Uncheck to hide/block this category and its products from the store")

    def __str__(self):
        return self.title

class Product(models.Model):
    product_id = models.CharField(max_length=100, unique=True) # e.g. "2-1", "3-5"
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    price = models.IntegerField(default=0)
    images = models.JSONField(default=list, blank=True) # e.g. ["/images/products/..."]
    desc = models.TextField()
    full_details = models.TextField(blank=True, null=True)
    specs = models.JSONField(default=dict, blank=True) # e.g. {"material": "PLA"}
    features = models.JSONField(default=list, blank=True) # e.g. ["Personalized", "Durable"]
    has_colors = models.BooleanField(default=False)
    color_options = models.JSONField(default=list, blank=True) # e.g. [{"color": "Red", "images": [...]}]
    has_sets = models.BooleanField(default=False, help_text="Enable quantity/bundle set options with custom pricing (e.g. Set of 2)")
    set_options = models.JSONField(default=list, blank=True, help_text="List of set tiers, e.g. [{'name': 'Set of 2', 'quantity': 2, 'price': 299}]")
    customizable = models.BooleanField(default=False)
    customization_label = models.CharField(max_length=255, blank=True, null=True)
    customization_placeholder = models.CharField(max_length=255, blank=True, null=True)
    custom_letters_limit = models.IntegerField(default=50, blank=True, null=True)
    is_bestseller = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, db_index=True, help_text="Uncheck to hide/block this product from the store")

    def __str__(self):
        return f"{self.topic.title}: {self.name}"


class AdminSession(models.Model):
    token = models.OneToOneField('authtoken.Token', on_delete=models.CASCADE, related_name='admin_session')
    mfa_verified = models.BooleanField(default=False)


DEFAULT_MARQUEE_ITEMS = [
    {
        'id': 'free-shipping',
        'icon': 'truck',
        'badge': 'Free Shipping',
        'badge_type': 'cyan',
        'main_text': 'on Orders',
        'highlight_text': 'Above ₹500',
        'target': '#products'
    },
    {
        'id': 'exclusive-deals',
        'icon': 'zap',
        'badge': 'Limited Offer',
        'badge_type': 'gold',
        'main_text': 'Exclusive Deals',
        'highlight_text': 'Available Now',
        'target': '#products'
    },
    {
        'id': 'latest-collection',
        'icon': 'sparkles',
        'badge': 'New Season',
        'badge_type': 'blue',
        'main_text': 'Shop the',
        'highlight_text': 'Latest Collection',
        'target': '#products'
    },
    {
        'id': 'custom-designs',
        'icon': 'tag',
        'badge': 'Custom Studio',
        'badge_type': 'blue',
        'main_text': 'Personalized Keychains &',
        'highlight_text': 'Custom 3D Gifts',
        'target': '/contact'
    },
    {
        'id': 'craftsmanship',
        'icon': 'flame',
        'badge': 'Made in India',
        'badge_type': 'gold',
        'main_text': 'Precision 3D Printed with',
        'highlight_text': 'Pro-Grade Materials',
        'target': '#products'
    }
]

DEFAULT_HERO_VIDEOS = [
    '/videos/hero-background1.mp4',
    '/videos/hero-background2.mp4',
    '/videos/hero-background3.mp4'
]

def default_marquee_items():
    return DEFAULT_MARQUEE_ITEMS

def default_hero_videos():
    return DEFAULT_HERO_VIDEOS

class SiteSetting(models.Model):
    # Marquee Controls
    marquee_enabled = models.BooleanField(default=True)
    marquee_speed = models.IntegerField(default=75) # seconds
    marquee_items = models.JSONField(default=default_marquee_items, blank=True)

    # Hero Media Controls
    hero_media_type = models.CharField(max_length=20, default='video', choices=[('video', 'Video'), ('image', 'Image')])
    hero_image = models.CharField(max_length=500, blank=True, null=True)
    hero_images = models.JSONField(default=list, blank=True)
    hero_carousel_enabled = models.BooleanField(default=False)
    hero_carousel_speed = models.IntegerField(default=5) # seconds per slide
    hero_videos = models.JSONField(default=default_hero_videos, blank=True)
    hero_title = models.CharField(max_length=255, default='Precision 3D Creations', blank=True)
    hero_subtitle = models.TextField(default='Crafted for Creators, Collectors & Modern Spaces', blank=True)

    # Colors & Theme Customization
    header_theme = models.CharField(max_length=50, default='dark', blank=True)
    header_bg_color = models.CharField(max_length=50, default='rgba(255, 255, 255, 0.98)', blank=True)
    header_text_color = models.CharField(max_length=50, default='#0F172A', blank=True)

    marquee_bg_color = models.CharField(max_length=150, default='linear-gradient(90deg, #090E1A 0%, #0F172A 50%, #090E1A 100%)', blank=True)
    marquee_text_color = models.CharField(max_length=50, default='#F1F5F9', blank=True)
    marquee_accent_color = models.CharField(max_length=50, default='#60A5FA', blank=True)
    marquee_border_color = models.CharField(max_length=50, default='rgba(59, 130, 246, 0.22)', blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Site Settings (Updated: {self.updated_at})"

