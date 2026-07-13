from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, verbose_name="Telefon raqami")
    address = models.CharField(max_length=255, blank=True, verbose_name="Yetkazib berish manzili")
    avatar = models.ImageField(upload_to='avatars/%Y/%m/%d/', blank=True, null=True, verbose_name="Profil rasmi")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil"
        verbose_name_plural = "Profillar"

    def __str__(self):
        return f"{self.user.username} profili"

    @property
    def avatar_url(self):
        if self.avatar and hasattr(self.avatar, 'url'):
            return self.avatar.url
        return None


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """Foydalanuvchi yaratilganda avtomatik ravishda unga Profile yaratadi."""
    if created:
        Profile.objects.create(user=instance)
    else:
        # Ba'zi eski userlarda profile bo'lmasligi mumkin (masalan admin orqali yaratilgan)
        Profile.objects.get_or_create(user=instance)