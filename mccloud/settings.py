"""
Django settings for mccloud project.

Generated by 'django-admin startproject' using Django 1.11.4.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
with open('%s/deploy/secret_key.txt' % BASE_DIR) as f:
     SECRET_KEY = f.read().strip()


#SECURE_HSTS_SECONDS = 3600
#SECURE_HSTS_INCLUDE_SUBDOMAINS=True
#SECURE_CONTENT_TYPE_NOSNIFF=True
#SECURE_SSL_REDIRECT=True
#SESSION_COOKIE_SECURE=True
#CSRF_COOKIE_SECURE=True
#X_FRAME_OPTIONS='DENY'
#SECURE_HSTS_PRELOAD=True
#SECURE_BROWSER_XSS_FILTER=True

#EMail
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.163.com'                   
EMAIL_PORT = 25                                 
with open('%s/deploy/email_user.txt' % BASE_DIR) as f:
     EMAIL_HOST_USER = f.read().strip()
with open('%s/deploy/email_password.txt' % BASE_DIR) as f:
     EMAIL_HOST_PASSWORD = f.read().strip()
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_SUBJECT_PREFIX = 'mccloud'            
EMAIL_USE_TLS = False                             

# SECURITY WARNING: don't run with debug turned on in production!
#DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'testserver', '*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'mccloud',
    'users',
    'rest_framework',
    'home',
    'mc',
    'store',
]

AUTH_USER_MODEL = 'users.User'
USERS_VERIFY_EMAIL = True
USERS_AUTO_LOGIN_ON_ACTIVATION = True
USERS_EMAIL_CONFIRMATION_TIMEOUT_DAYS = 3
USERS_SPAM_PROTECTION = True


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mccloud.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': False,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'loaders': [
                # PyPugJS part:   ##############################
                ('pypugjs.ext.django.Loader', (
                    'django.template.loaders.filesystem.Loader',
                    'django.template.loaders.app_directories.Loader',
                ))
            ],
            'builtins': ['pypugjs.ext.django.templatetags'],
        },
    },
]

WSGI_APPLICATION = 'mccloud.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases
with open('%s/deploy/db_user.txt' % BASE_DIR) as f:
    DB_USER = f.read().strip()
with open('%s/deploy/db_password.txt' % BASE_DIR) as f:
    DB_PASSWORD = f.read().strip()
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mccloud',
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        "HOST": "localhost",
    },
}
DB_PASSWORD=None


# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'collected_static')
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "common_static"),
)
STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder"
)


LOGIN_REDIRECT_URL = '/mc'

#Celery Config
#BROKER_URL = 'amqp://guest:guest@localhost:5672//'
BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
#BROKER_URL = 'amqp://xuch:hg7y82hl@localhost:5672/xuch_host'
#CELERY_RESULT_BACKEND = 'amqp://xuch:hg7y82hl@localhost:5672/xuch_host'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

