from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.product_list, name='product_list'),
    path('banner/<slug:slug>/', views.banner_detail, name='banner_detail'),

    # 1. YANGI SAHIFA (Kategoriyadan tepada turishi shart! 🚀)
    path('wishlist/', views.wishlist_detail, name='wishlist_detail'),

    # 2. YURAKCHA BOSILGANDA ISHLAYDIGAN YO'LAK
    path('product/<int:product_id>/toggle-wishlist/', views.toggle_wishlist, name='toggle_wishlist'),

    path('product/<int:id>/<slug:slug>/', views.product_detail, name='product_detail'),

    # 3. KATEGORIYA YO'LAGI (Eng pastda turishi shart!)
    path('<slug:category_slug>/', views.product_list, name='product_list_by_category'),
]