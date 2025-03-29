from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff','email_verified','email_verification_token')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)