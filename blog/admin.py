from django.contrib import admin
from .models import Category, Product, Banner, Review


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'badge_text', 'category', 'is_active', 'order']
    list_filter = ['is_active', 'color']
    list_editable = ['is_active', 'order']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['products']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'discount_percent', 'stock', 'available', 'created']
    list_filter = ['available', 'category', 'created']
    list_editable = ['price', 'discount_percent', 'stock', 'available']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created']
    list_filter = ['rating', 'created']
    search_fields = ['product__name', 'user__username', 'comment']
    autocomplete_fields = ['product', 'user']