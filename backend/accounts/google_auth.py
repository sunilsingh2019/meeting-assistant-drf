from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import requests
import os

User = get_user_model()

class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Exchange authorization code for tokens
            token_url = 'https://oauth2.googleapis.com/token'
            client_id = os.environ.get('GOOGLE_CLIENT_ID')
            client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
            frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3001')

            if not client_id or not client_secret:
                return Response(
                    {'error': 'Google OAuth credentials are not properly configured'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            data = {
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': f'{frontend_url}/auth/google/callback',
                'grant_type': 'authorization_code',
            }

            # Add OAuth app configuration
            oauth_config = {
                'application_name': 'Meeting Assistant',
                'privacy_policy_url': f'{frontend_url}/privacy',
                'terms_of_service_url': f'{frontend_url}/terms'
            }

            token_response = requests.post(token_url, data=data)
            token_response.raise_for_status()
            token_data = token_response.json()

            if 'error' in token_data:
                return Response({'error': token_data['error']}, status=status.HTTP_400_BAD_REQUEST)

            # Get user info from Google
            access_token = token_data['access_token']
            userinfo_response = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            google_user = userinfo_response.json()

            # Get or create user
            user, created = User.objects.get_or_create(
                email=google_user['email'],
                defaults={
                    'username': google_user['email'].split('@')[0],
                    'first_name': google_user.get('given_name', ''),
                    'last_name': google_user.get('family_name', ''),
                }
            )

            # Send welcome email for new users
            if created:
                html_message = render_to_string('email_templates/welcome_email.html', {
                    'first_name': user.first_name
                })
                send_mail(
                    subject='Welcome to Meeting Assistant!',
                    message='',
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                )

            # Create or get auth token
            token, _ = Token.objects.get_or_create(user=user)

            response_data = {
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'oauth_config': oauth_config,
                'is_new_user': created  # Add flag for new users
            }

            # Include refresh token if provided
            if 'refresh_token' in token_data:
                response_data['refresh_token'] = token_data['refresh_token']

            return Response(response_data)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)