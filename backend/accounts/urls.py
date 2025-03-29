from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, ChangePasswordView,
    VerifyEmailView, ResendVerificationEmailView,
    PasswordResetRequestView, PasswordResetConfirmView,
    UserPreferencesView, CompleteOnboardingView, MeView
)
from .google_auth import GoogleAuthView
from .microsoft_auth import MicrosoftAuthView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('verify-email/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-verification-email/', ResendVerificationEmailView.as_view(), name='resend-verification-email'),
    path('reset-password/', PasswordResetRequestView.as_view(), name='reset-password-request'),
    path('reset-password-confirm/', PasswordResetConfirmView.as_view(), name='reset-password-confirm'),
    path('preferences/', UserPreferencesView.as_view(), name='user-preferences'),
    path('complete-onboarding/', CompleteOnboardingView.as_view(), name='complete-onboarding'),
    path('google/', GoogleAuthView.as_view(), name='google-auth'),
    path('microsoft/', MicrosoftAuthView.as_view(), name='microsoft-auth'),
]