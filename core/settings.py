"""
Django settings for core project.
"""

from pathlib import Path
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "_r9*k7)3m_gz&163msr(@iwr42+qrrl89+vtitm%w!253%+0cd"
)

DEBUG = True

ALLOWED_HOSTS = [
    "usmonov77.pythonanywhere.com",  # <-- o'zingizning PythonAnywhere usernameingizni yozing
    "127.0.0.1",
    "localhost",
]

# Application definition
INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "orders",
    "blog",
    "cart",
    'accounts',
    "imagekit",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'blog.context_processors.categories_processor',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database parolni environment variable'dan olish xavfsizroq.
# Agar DATABASE_URL environment variable topilmasa, pastdagi default ishlatiladi.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Tashkent'
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

LOGIN_URL = 'accounts:login'
LOGIN_REDIRECT_URL = 'blog:product_list'
LOGOUT_REDIRECT_URL = 'blog:product_list'

SESSION_COOKIE_NAME = 'sessionid'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ============ IMAGEKIT ASOSIY SOZLAMALARI ============
IMAGEKITIO_SETTINGS = {
    'PUBLIC_KEY': os.environ.get('IMAGEKIT_PUBLIC_KEY', 'public_gYr7hQX7+BlFEzCCKmc+G/y1gJs='),
    'PRIVATE_KEY': os.environ.get('IMAGEKIT_PRIVATE_KEY', 'private_dvuF/qPqq+zXEAHoq7wAh6YUC9o='),
    'URL_ENDPOINT': 'https://ik.imagekit.io/xrq0z19i9'
}

# ============ JAZZMIN SOZLAMALARI ============
JAZZMIN_SETTINGS = {
    "site_title": "MyShop Admin",
    "site_header": "MyShop",
    "site_brand": "MyShop",
    "site_logo": None,
    "login_logo": None,
    "login_logo_dark": None,
    "site_logo_classes": "img-circle",
    "site_icon": None,
    "welcome_sign": "MyShop boshqaruv paneliga xush kelibsiz",
    "copyright": "MyShop",
    "search_model": ["blog.Product", "auth.User"],
    "user_avatar": None,
    "topmenu_links": [
        {"name": "Saytga o'tish", "url": "/", "permissions": ["auth.view_user"]},
        {"model": "auth.User"},
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "order_with_respect_to": ["blog", "cart", "accounts", "auth"],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "blog.Category": "fas fa-tags",
        "blog.Product": "fas fa-box",
        "cart.Cart": "fas fa-shopping-cart",
        "cart.CartItem": "fas fa-shopping-basket",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    "related_modal_active": True,
    "custom_css": None,
    "custom_js": None,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "blog.product": "horizontal_tabs",
    },
    "language_chooser": False,
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-dark",
    "accent": "accent-warning",
    "navbar": "navbar-dark",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "darkly",
    "dark_mode_theme": "darkly",
    "button_classes": {
        "primary": "btn-warning",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
}
