from urllib.parse import urlsplit
from rest_framework import serializers
from .models import Topic, Product, SiteSetting


def validate_image_url(value):
    if not isinstance(value, str) or len(value) > 1000 or any(ord(c) < 32 for c in value):
        raise serializers.ValidationError('Invalid image URL.')
    if value.startswith('/') and not value.startswith('//') and '..' not in value.split('/'):
        return value
    parsed = urlsplit(value)
    if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
        raise serializers.ValidationError('Use a local image path or an HTTPS image URL.')
    return value

def validate_images(values):
    if not isinstance(values, list) or len(values) > 20:
        raise serializers.ValidationError('Provide no more than 20 image URLs.')
    return [validate_image_url(value) for value in values]

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'
    def validate_image(self, value):
        return validate_image_url(value) if value else value

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
    def validate_images(self, values):
        return validate_images(values)
    def validate_features(self, values):
        if not isinstance(values, list) or len(values) > 30 or any(not isinstance(v, str) or len(v) > 300 for v in values):
            raise serializers.ValidationError('Provide a list of short feature descriptions.')
        return values
    def validate_color_options(self, values):
        if not isinstance(values, list) or len(values) > 30:
            raise serializers.ValidationError('Invalid colour options.')
        for item in values:
            if not isinstance(item, dict): raise serializers.ValidationError('Invalid colour option.')
            validate_images(item.get('images', []))
        return values
    def validate_set_options(self, values):
        if not isinstance(values, list) or len(values) > 20:
            raise serializers.ValidationError('Invalid set options.')
        for item in values:
            if not isinstance(item, dict):
                raise serializers.ValidationError('Invalid set option.')
            if 'price' in item and item['price'] != '' and item['price'] is not None:
                try:
                    p = float(item['price'])
                    if p < 0: raise serializers.ValidationError('Set price cannot be negative.')
                except (ValueError, TypeError):
                    raise serializers.ValidationError('Set price must be a valid number.')
        return values
    def validate_price(self, value):
        if value < 0: raise serializers.ValidationError('Price cannot be negative.')
        return value

class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = '__all__'

