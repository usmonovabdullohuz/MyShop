from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('blog:category_detail', args=[self.slug])


class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = ProcessedImageField(
        upload_to='products/%Y/%m/%d/',
        processors=[ResizeToFill(800, 800)],
        format='JPEG',
        options={'quality': 90},
        blank=True,
        null=True
    )
    discount_percent = models.PositiveIntegerField(
        default=0,
        help_text="Chegirma foizi (0-100). Masalan 25 kiritsangiz, 25% chegirma bo'ladi.",
        null=True,
        blank=True
    )
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['available', 'category']),
            models.Index(fields=['available', '-created']),
            models.Index(fields=['available', 'price']),
            models.Index(fields=['available', '-discount_percent']),
        ]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('blog:product_detail', args=[self.id, self.slug])

    @property
    def has_discount(self):
        return self.discount_percent is not None and self.discount_percent > 0

    @property
    def discounted_price(self):
        if self.has_discount:
            discount_amount = self.price * self.discount_percent / 100
            return round(self.price - discount_amount, 2)
        return self.price

    def get_average_rating(self):
        avg = self.reviews.aggregate(models.Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_review_count(self):
        return self.reviews.count()


# ============ YANGI QISM - shu yerga qo'shiladi ============
class Banner(models.Model):
    COLOR_CHOICES = [
        ('promo-1', 'Binafsha-ko\'k'),
        ('promo-2', 'Binafsha-pushti'),
        ('promo-3', 'Jigarrang'),
        ('promo-4', 'Yashil'),
        ('promo-5', 'Sariq-jigarrang'),
        ('promo-6', 'Och pushti (och fon)'),
        ('promo-7', 'Ko\'k-neon (texnologik)'),
    ]
    title = models.CharField(max_length=100, help_text="Masalan: Boshlandi!")
    subtitle = models.CharField(max_length=150, help_text="Masalan: 30% gacha chegirma")
    badge_text = models.CharField(max_length=50, help_text="Masalan: Yozgi chegirmalar")
    slug = models.SlugField(unique=True)
    color = models.CharField(max_length=20, choices=COLOR_CHOICES, default='promo-1')
    image = models.ImageField(upload_to='banners/', blank=True, null=True)

    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='banners', help_text="Agar tanlansa, banner shu kategoriyaga yo'naltiradi"
    )
    products = models.ManyToManyField(
        Product, blank=True, related_name='banners',
        help_text="Agar kategoriya tanlanmasa, shu mahsulotlar ko'rsatiladi"
    )

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Tartib raqami (kichik son oldin chiqadi)")
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('blog:banner_detail', args=[self.slug])


class Review(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']
        unique_together = ('product', 'user')
        verbose_name = "Sharh"
        verbose_name_plural = "Sharhlar"

    def __str__(self):
        return f"{self.user.username} — {self.product.name} ({self.rating}★)"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlist")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"