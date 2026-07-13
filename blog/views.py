from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from .models import Category, Product, Banner, Review, Wishlist
from .forms import ReviewForm


def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(available=True)
    banners = Banner.objects.filter(is_active=True)

    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)

    query = request.GET.get('q')
    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )

    wishlist_ids = []
    if request.user.is_authenticated:
        wishlist_ids = list(
            Wishlist.objects.filter(user=request.user).values_list('product_id', flat=True)
        )

    return render(request, 'blog/product/list.html', {
        'category': category,
        'categories': categories,
        'products': products,
        'query': query,
        'banners': banners,
        'wishlist_ids': wishlist_ids,
    })


def product_detail(request, id, slug):
    product = get_object_or_404(Product, id=id, slug=slug, available=True)
    reviews = product.reviews.select_related('user')

    user_review = None
    if request.user.is_authenticated:
        user_review = reviews.filter(user=request.user).first()

    if request.method == 'POST':
        if not request.user.is_authenticated:
            messages.error(request, "Sharh qoldirish uchun avval tizimga kiring.")
            return redirect('accounts:login')

        if user_review:
            messages.warning(request, "Siz bu mahsulotga allaqachon sharh qoldirgansiz.")
            return redirect(product.get_absolute_url())

        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.product = product
            review.user = request.user
            review.save()
            messages.success(request, "Sharhingiz uchun rahmat!")
            return redirect(product.get_absolute_url())
    else:
        form = ReviewForm()

    return render(request, 'blog/product/detail.html', {
        'product': product,
        'reviews': reviews,
        'user_review': user_review,
        'form': form,
    })


def toggle_wishlist(request, product_id):
    if not request.user.is_authenticated:
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Login required'}, status=403)
        return redirect('accounts:login')

    product = get_object_or_404(Product, id=product_id)

    wishlist_item = Wishlist.objects.filter(user=request.user, product=product).first()

    if wishlist_item:
        wishlist_item.delete()
        wished = False
    else:
        Wishlist.objects.create(user=request.user, product=product)
        wished = True

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({
            'wished': wished,
            'count': Wishlist.objects.filter(user=request.user).count()
        })

    return redirect(request.META.get('HTTP_REFERER', 'blog:product_list'))


def banner_detail(request, slug):
    banner = get_object_or_404(Banner, slug=slug, is_active=True)

    if banner.category:
        products = Product.objects.filter(category=banner.category, available=True)
    else:
        products = banner.products.filter(available=True)

    return render(request, 'blog/product/banner_detail.html', {
        'banner': banner,
        'products': products,
    })


@login_required
def wishlist_detail(request):
    user_wishlist = Wishlist.objects.filter(user=request.user).select_related('product')
    return render(request, 'blog/wishlist_detail.html', {'wishlist': user_wishlist})