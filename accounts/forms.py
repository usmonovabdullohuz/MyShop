from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from .models import Profile


class RegisterForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        label="Email",
        help_text="Elektron pochta manzilingizni kiriting."
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        labels = {
            'username': 'Foydalanuvchi nomi',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['username'].help_text = (
            "Majburiy. 150 ta belgigacha. Faqat harflar, raqamlar va @/./+/-/_ belgilaridan foydalaning."
        )
        self.fields['password1'].label = "Parol"
        self.fields['password1'].help_text = (
            "<ul>"
            "<li>Parolingiz shaxsiy ma'lumotlaringizga juda o'xshash bo'lmasligi kerak.</li>"
            "<li>Parolingiz kamida 8 ta belgidan iborat bo'lishi kerak.</li>"
            "<li>Parolingiz keng tarqalgan parol bo'lmasligi kerak.</li>"
            "<li>Parolingiz faqat raqamlardan iborat bo'lmasligi kerak.</li>"
            "</ul>"
        )
        self.fields['password2'].label = "Parolni tasdiqlash"
        self.fields['password2'].help_text = (
            "Tasdiqlash uchun avvalgi parolni qaytadan kiriting."
        )

        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})


class LoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['username'].label = "Foydalanuvchi nomi"
        self.fields['password'].label = "Parol"

        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})

    error_messages = {
        'invalid_login': (
            "Iltimos, to'g'ri foydalanuvchi nomi va parolni kiriting. "
            "Diqqat, har ikkala maydon ham katta-kichik harflarga sezgir bo'lishi mumkin."
        ),
        'inactive': "Bu hisob faol emas.",
    }


class UserUpdateForm(forms.ModelForm):
    """Foydalanuvchining asosiy ma'lumotlari: ism, familiya, email."""

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
        labels = {
            'first_name': 'Ism',
            'last_name': 'Familiya',
            'email': 'Email',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})


class ProfileUpdateForm(forms.ModelForm):
    """Profil qo'shimcha ma'lumotlari: telefon, manzil, avatar."""

    class Meta:
        model = Profile
        fields = ['phone', 'address', 'avatar']
        labels = {
            'phone': 'Telefon raqami',
            'address': 'Manzil',
            'avatar': 'Profil rasmi',
        }
        widgets = {
            'phone': forms.TextInput(attrs={'placeholder': '+998 90 123 45 67'}),
            'address': forms.TextInput(attrs={'placeholder': 'Shahar, ko\'cha, uy raqami'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if name == 'avatar':
                field.widget.attrs.update({'class': 'form-control'})
            else:
                field.widget.attrs.update({'class': 'form-control'})