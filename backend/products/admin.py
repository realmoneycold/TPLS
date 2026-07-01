from django.contrib import admin
from .models import Category, Product, ProductSize, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'category', 'gender', 'is_featured', 'is_rotation', 'created_at')
    list_filter = ('category', 'gender', 'is_featured', 'is_rotation')
    list_editable = ('is_featured', 'is_rotation')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProductSizeInline, ProductImageInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
