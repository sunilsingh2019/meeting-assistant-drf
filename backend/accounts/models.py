from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.crypto import get_random_string
from django.contrib.postgres.fields import ArrayField

class User(AbstractUser):
    """Custom user model for extended functionality"""
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, blank=True, null=True, unique=True)
    microsoft_token = models.JSONField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    @classmethod
    def get_user_by_verification_token(cls, token):
        """
        Get a user by their verification token, ensuring the token is valid
        """
        if not token or len(token) != 64:
            return None
        try:
            return cls.objects.get(email_verification_token=token, email_verified=False)
        except cls.DoesNotExist:
            return None

    def generate_verification_token(self):
        """
        Generate a verification token and save it to the user's record.
        
        Returns:
            str: The generated verification token
        """
        token = get_random_string(64)
        self.email_verification_token = token
        self.save(update_fields=['email_verification_token'])
        return token

    class Meta:
        ordering = ['-date_joined']

def default_work_days():
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    working_hours_start = models.TimeField(default='09:00')
    working_hours_end = models.TimeField(default='17:00')
    work_days = ArrayField(
        models.CharField(max_length=10),
        default=default_work_days
    )
    preferred_meeting_duration = models.IntegerField(default=30)
    has_completed_onboarding = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'User preferences'

    def __str__(self):
        return f'Preferences for {self.user.email}'