from django.contrib import admin
from .models import Topic, Product, SiteSetting

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'icon', 'is_active')
    list_filter = ('is_active',)
    list_editable = ('is_active',)
    search_fields = ('title', 'desc')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'name', 'topic', 'price', 'is_active', 'is_bestseller', 'customizable', 'has_colors')
    list_filter = ('is_active', 'is_bestseller', 'topic', 'customizable', 'has_colors')
    search_fields = ('product_id', 'name', 'desc')
    list_editable = ('is_active', 'is_bestseller', 'price')

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('id', 'marquee_enabled', 'marquee_speed', 'hero_media_type', 'updated_at')
    fieldsets = (
        ('Marquee Bar Controls', {
            'fields': ('marquee_enabled', 'marquee_speed', 'marquee_items'),
            'description': 'Toggle announcement marquee on/off, adjust ticker speed, and manage announcement cards.'
        }),
        ('Hero Section Media Controls', {
            'fields': (
                'hero_media_type', 'hero_image', 'hero_images',
                'hero_carousel_enabled', 'hero_carousel_speed',
                'hero_videos', 'hero_title', 'hero_subtitle'
            ),
            'description': 'Switch between Video playlist and custom Hero Image/Carousel slideshow, and customize titles.'
        }),
        ('Header & Marquee Theme Colors', {
            'fields': (
                'header_theme', 'header_bg_color', 'header_text_color',
                'marquee_bg_color', 'marquee_text_color', 'marquee_accent_color', 'marquee_border_color'
            ),
            'description': 'Fine-tune colors for navbar and marquee to match hero background visuals.'
        }),
    )

