from rest_framework import serializers
from .models import Category, Product, ProductSize, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['id', 'size', 'stock']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'is_primary']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    sizes = ProductSizeSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    price_formatted = serializers.SerializerMethodField()
    colors = serializers.SerializerMethodField() # Mock for now until we add color model

    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'description', 'price', 'price_formatted', 'category', 'gender', 'sizes', 'images', 'colors', 'created_at', 'is_featured', 'is_rotation']

    def get_price_formatted(self, obj):
        # Format like Rp 399.000
        return f"Rp {int(obj.price):,}".replace(',', '.')
        
    def get_colors(self, obj):
        # We can just return some dummy colors or add a Color model later. 
        # For now, let's just return a default array to match frontend
        return ['#000', '#fff']
