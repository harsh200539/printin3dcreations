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
    list_display = ('product_id', 'name', 'topic', 'price', 'is_active', 'is_bestseller', 'has_sets', 'has_colors', 'customizable')
    list_filter = ('has_sets', 'is_active', 'is_bestseller', 'has_colors', 'customizable', 'topic')
    search_fields = ('product_id', 'name', 'desc')
    list_editable = ('is_active', 'is_bestseller', 'price')
    fieldsets = (
        ('Basic Information', {
            'fields': ('product_id', 'topic', 'name', 'price', 'is_active', 'is_bestseller', 'desc', 'full_details', 'images')
        }),
        ('📦 Product Set / Pack Pricing', {
            'fields': ('has_sets', 'set_options'),
            'description': 'Enable bundle/set options (e.g. Set of 2, Set of 4) with custom prices. Example set_options: [{"name": "Set of 2", "quantity": 2, "price": 249}, {"name": "Set of 4", "quantity": 4, "price": 449}]'
        }),
        ('🎨 Color Variants', {
            'fields': ('has_colors', 'color_options'),
            'description': 'Enable color options and assign specific product images per color shade.'
        }),
        ('✨ Customization Settings', {
            'fields': ('customizable', 'customization_label', 'customization_placeholder', 'custom_letters_limit')
        }),
        ('⚙️ Technical Specs & Features', {
            'fields': ('specs', 'features'),
            'classes': ('collapse',)
        }),
    )

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

