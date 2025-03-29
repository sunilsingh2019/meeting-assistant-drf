from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model, authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserSerializer, LoginSerializer, ChangePasswordSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    UserPreferencesSerializer, MeSerializer
)
from .models import UserPreferences
from django.db import models

User = get_user_model()

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        print("\n=== Registration Debug ===")
        print("Received registration data:", request.data)
        
        try:
            # Validate the data
            serializer = UserSerializer(data=request.data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Create and save the user
            user = serializer.save()
            print(f"Created user instance: {user.email}")
            
            # Generate verification token
            print("\nGenerating verification token...")
            token = user.generate_verification_token()
            print(f"Generated token: {token}")
            
            # Generate verification URL
            verification_url = f"{settings.FRONTEND_URL}/auth/verify-email/{token}"
            print(f"Verification URL: {verification_url}")
            
            # Prepare email context
            context = {
                'user': user,
                'verification_url': verification_url,
                'frontend_url': settings.FRONTEND_URL
            }
            
            # Generate and send email
            print("\nPreparing verification email...")
            html_message = render_to_string('email_templates/verify_email.html', context)
            plain_message = strip_tags(html_message)
            
            try:
                send_mail(
                    subject='Verify your Meeting Assistant account',
                    message=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    html_message=html_message,
                    fail_silently=False,
                )
                print("Verification email sent successfully")
            except Exception as e:
                print(f"Error sending email: {str(e)}")
                # Delete the user if email sending fails
                user.delete()
                return Response({
                    'error': 'Failed to send verification email. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            print("=== End Registration Debug ===\n")
            
            return Response({
                'message': 'Registration successful. Please check your email to verify your account.',
                'email': user.email
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Error during registration: {str(e)}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyEmailView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request, token):
        try:
            print("\n=== Email Verification Debug ===")
            print(f"Attempting to verify token: {token}")
            print(f"Token length: {len(token)}")
            
            # Validate token format
            if not token or len(token) != 64:
                print(f"Invalid token format: {token}, length: {len(token)}")
                return Response({
                    'error': 'Invalid verification token format'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check all users and their tokens
            print("\nChecking all users and their tokens:")
            all_users = User.objects.all().values('email', 'email_verification_token', 'email_verified')
            for user in all_users:
                print(f"User: {user['email']}")
                print(f"Token: {user['email_verification_token']}")
                print(f"Verified: {user['email_verified']}")
                print("---")
            
            # Try to find the user directly first
            try:
                direct_user = User.objects.get(email_verification_token=token)
                print(f"\nFound user directly with token: {direct_user.email}")
                print(f"User verified status: {direct_user.email_verified}")
            except User.DoesNotExist:
                print("\nNo user found directly with this token")
            
            # Get user using the class method
            user = User.get_user_by_verification_token(token)
            
            if not user:
                print("\nNo valid user found for verification")
                # Try to find if token existed but was already used
                verified_user = User.objects.filter(
                    models.Q(email_verification_token=token) | 
                    models.Q(email_verification_token__isnull=True),
                    email_verified=True
                ).first()
                
                if verified_user:
                    print(f"Found already verified user: {verified_user.email}")
                    return Response({
                        'error': 'This email has already been verified'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                print("Token not found in database")
                return Response({
                    'error': 'Invalid or expired verification token'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            print(f"\nProceeding with verification for user: {user.email}")
            
            # Verify the email
            user.email_verified = True
            user.email_verification_token = None  # Clear the token after use
            user.save()
            
            print(f"Successfully verified email for user: {user.email}")
            print("=== End Debug ===\n")
            
            return Response({
                'message': 'Email successfully verified'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print("\n=== Verification Error ===")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            import traceback
            print("\nFull traceback:")
            print(traceback.format_exc())
            print("=== End Error ===\n")
            return Response({
                'error': 'An error occurred while verifying your email'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResendVerificationEmailView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({
                'error': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if user.email_verified:
                return Response({
                    'error': 'Email already verified'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate verification token
            token = user.generate_verification_token()
            
            verification_url = f"{settings.FRONTEND_URL}/auth/verify-email/{token}"
            
            context = {
                'user': user,
                'verification_url': verification_url,
                'frontend_url': settings.FRONTEND_URL
            }
            
            html_message = render_to_string('email_templates/verify_email.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject='Verify your Meeting Assistant account',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            return Response({
                'message': 'Verification email sent'
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'error': 'No user found with this email address'
            }, status=status.HTTP_404_NOT_FOUND)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            print("\n=== Login Debug ===")
            print("Login request data:", request.data)
            
            serializer = self.serializer_class(data=request.data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            login = serializer.validated_data['login']
            password = serializer.validated_data['password']
            
            print(f"Attempting login with email: {login}")
            
            try:
                user = User.objects.get(email=login)
            except User.DoesNotExist:
                print(f"No user found with email: {login}")
                return Response(
                    {'error': 'No account found with this email address'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if not user.check_password(password):
                print("Invalid password")
                return Response(
                    {'error': 'Invalid password'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Check if email is verified
            if not user.email_verified:
                print(f"User not verified: {user.email}")
                return Response({
                    'error': 'Please verify your email address before signing in.',
                    'email': user.email,
                    'requires_verification': True
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Generate JWT tokens
            print("Generating JWT tokens")
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.pk,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'has_completed_onboarding': getattr(user, 'has_completed_onboarding', False)
                }
            }
            print("Login successful")
            print("=== End Login Debug ===\n")
            
            return Response(response_data)
            
        except Exception as e:
            print("\n=== Login Error ===")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            import traceback
            print("\nFull traceback:")
            print(traceback.format_exc())
            print("=== End Error ===\n")
            return Response(
                {'error': 'An error occurred during login. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.get_object()
        if not user.check_password(serializer.data.get('old_password')):
            return Response({"old_password": ["Wrong password."]}, 
                            status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.data.get('new_password'))
        user.save()
        return Response({"message": "Password updated successfully"}, 
                        status=status.HTTP_200_OK)

class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
            token = get_random_string(length=32)
            user.set_password(token)
            user.save()

            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
            html_message = render_to_string('email_templates/password_reset_email.html', {
                'reset_url': reset_url
            })
            send_mail(
                subject='Password Reset Request',
                message='',
                html_message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False
            )
            return Response({"message": "Password reset email sent successfully"})
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"},
                            status=status.HTTP_404_NOT_FOUND)

class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(password=serializer.validated_data['token'])
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({"message": "Password has been reset successfully"})
        except User.DoesNotExist:
            return Response({"error": "Invalid token"},
                            status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class UserPreferencesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        preferences, _ = UserPreferences.objects.get_or_create(user=request.user)
        serializer = UserPreferencesSerializer(preferences)
        return Response(serializer.data)
    
    def put(self, request):
        preferences, _ = UserPreferences.objects.get_or_create(user=request.user)
        serializer = UserPreferencesSerializer(preferences, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompleteOnboardingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        preferences, _ = UserPreferences.objects.get_or_create(user=request.user)
        preferences.has_completed_onboarding = True
        preferences.save()
        return Response({'status': 'onboarding completed'})

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MeSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)