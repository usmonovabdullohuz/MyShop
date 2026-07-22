from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from cart.models import Cart
from .models import Order, OrderItem
from .forms import CheckoutForm


@login_required
def checkout(request):
    cart, created = Cart.objects.get_or_create(user=request.user)

    if not cart.items.exists():
        messages.warning(request, "Savatingiz bo'sh. Buyurtma berish uchun avval mahsulot qo'shing.")
        return redirect('cart:cart_detail')

    initial = {
        'full_name': request.user.get_full_name() or request.user.username,
    }
    profile = getattr(request.user, 'profile', None)
    if profile:
        initial['phone'] = profile.phone
        initial['address'] = profile.address

    if request.method == 'POST':
        form = CheckoutForm(request.POST, initial=initial)
        if form.is_valid():
            with transaction.atomic():
                order = form.save(commit=False)
                order.user = request.user
                order.status = Order.STATUS_PENDING
                order.save()

                for cart_item in cart.items.select_related('product'):
                    OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        product_name=cart_item.product.name,
                        price=cart_item.product.price,
                        quantity=cart_item.quantity,
                    )

                cart.items.all().delete()

            if order.payment_method == Order.PAYMENT_CASH:
                messages.success(request, f"Buyurtma #{order.id} qabul qilindi! Tez orada operatorlarimiz siz bilan bog'lanadi.")
                return redirect('orders:order_detail', order_id=order.id)
            else:
                # Payme/Click integratsiyasi keyinroq shu yerga ulanadi.
                # Hozircha to'lov sahifasiga yo'naltirilgan bo'lib ko'rinadi.
                messages.info(request, "To'lov tizimi tez orada ulanadi. Hozircha buyurtmangiz qabul qilindi.")
                return redirect('orders:order_detail', order_id=order.id)
    else:
        form = CheckoutForm(initial=initial)

    return render(request, 'orders/checkout.html', {'form': form, 'cart': cart})


@login_required
def order_list(request):
    orders = Order.objects.filter(user=request.user).prefetch_related('items')
    return render(request, 'orders/order_list.html', {'orders': orders})


@login_required
def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'orders/order_detail.html', {'order': order})


@login_required
def order_cancel(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    if order.status == Order.STATUS_PENDING:
        order.status = Order.STATUS_CANCELLED
        order.save()
        messages.info(request, f"Buyurtma #{order.id} bekor qilindi.")
    else:
        messages.error(request, "Bu buyurtmani bekor qilib bo'lmaydi.")
    return redirect('orders:order_detail', order_id=order.id)