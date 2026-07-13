from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from blog.models import Product


class Order(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_PAID = 'paid'
    STATUS_SHIPPED = 'shipped'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (STATUS_PENDING, "To'lov kutilmoqda"),
        (STATUS_PAID, "To'landi"),
        (STATUS_SHIPPED, "Yetkazilmoqda"),
        (STATUS_COMPLETED, "Yakunlandi"),
        (STATUS_CANCELLED, "Bekor qilindi"),
    ]

    PAYMENT_CASH = 'cash'
    PAYMENT_PAYME = 'payme'
    PAYMENT_CLICK = 'click'

    PAYMENT_CHOICES = [
        (PAYMENT_CASH, "Naqd pul (yetkazib berishda)"),
        (PAYMENT_PAYME, "Payme"),
        (PAYMENT_CLICK, "Click"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    full_name = models.CharField(max_length=200, verbose_name="F.I.Sh")
    phone = models.CharField(max_length=20, verbose_name="Telefon raqami")
    address = models.CharField(max_length=255, verbose_name="Yetkazib berish manzili")
    comment = models.TextField(blank=True, verbose_name="Izoh")

    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default=PAYMENT_CASH)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default=STATUS_PENDING)

    # Payme/Click integratsiyasi uchun keyinroq ishlatiladigan maydonlar
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']
        verbose_name = "Buyurtma"
        verbose_name_plural = "Buyurtmalar"

    def __str__(self):
        return f"Buyurtma #{self.id} — {self.user.username}"

    def get_absolute_url(self):
        return reverse('orders:order_detail', args=[self.id])

    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())

    def get_total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def is_paid(self):
        return self.status in (self.STATUS_PAID, self.STATUS_SHIPPED, self.STATUS_COMPLETED)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    product_name = models.CharField(max_length=200)  # mahsulot o'chirilsa ham nomi saqlanadi
    price = models.DecimalField(max_digits=10, decimal_places=2)  # buyurtma paytidagi narx
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    def get_total_price(self):
        return self.price * self.quantity