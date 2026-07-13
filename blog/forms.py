from django import forms
from .models import Review


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.Select(attrs={'class': 'form-select'}),
            'comment': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': "Mahsulot haqida fikringizni yozing..."
            }),
        }
        labels = {
            'rating': 'Baho',
            'comment': 'Sharh',
        }