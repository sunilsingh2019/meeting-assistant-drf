from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
import requests
import os
import logging
import urllib.parse

logger = logging.getLogger(__name__)
User = get_user_model()

class MicrosoftAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        code_verifier = request.data.get('code_verifier')

        logger.info('Received Microsoft auth request')

        if not code or not code_verifier:
            logger.error('Missing required parameters: code or code_verifier')
            return Response(
                {'error': 'Both code and code_verifier are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get configuration from environment
            tenant_id = os.environ.get('MICROSOFT_TENANT_ID', 'common')
            client_id = os.environ.get('MICROSOFT_CLIENT_ID')
            client_secret = os.environ.get('MICROSOFT_CLIENT_SECRET')
            frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3001')
            redirect_uri = f'{frontend_url}/auth/microsoft/callback'

            logger.info(f'Using tenant ID: {tenant_id}')
            logger.info(f'Using client ID: {client_id}')
            logger.info(f'Using redirect URI: {redirect_uri}')

            if not client_id or not client_secret:
                logger.error('Microsoft OAuth credentials missing in environment')
                return Response(
                    {'error': 'Microsoft OAuth credentials are not properly configured'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Exchange authorization code for tokens using tenant-specific endpoint
            token_url = f'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token'

            # Prepare token request data
            data = {
                'client_id': client_id,
                'client_secret': client_secret,
                'grant_type': 'authorization_code',
                'code': code,
                'code_verifier': code_verifier,
                'redirect_uri': redirect_uri,
                'scope': 'openid profile email User.Read offline_access'
            }

            # URL encode the form data properly
            encoded_data = urllib.parse.urlencode(data)

            # Use form-encoded format for token request
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }

            # Log token request details (excluding sensitive info)
            logger.info(f'Making token request to: {token_url}')
            logger.debug('Token request data keys: ' + ', '.join(data.keys()))

            # Make token request
            token_response = requests.post(
                token_url,
                headers=headers,
                data=encoded_data,
                verify=True
            )
            
            if not token_response.ok:
                try:
                    error_data = token_response.json()
                except Exception:
                    error_data = {'error': 'Token request failed', 'error_description': token_response.text}
                logger.error(f'Token request failed: {token_response.status_code} - {token_response.text}')
                return Response(error_data, status=status.HTTP_400_BAD_REQUEST)

            token_data = token_response.json()

            if 'error' in token_data:
                logger.error(f'Error in token response: {token_data}')
                return Response(token_data, status=status.HTTP_400_BAD_REQUEST)

            # Get user info from Microsoft Graph API
            access_token = token_data['access_token']
            logger.info('Successfully obtained access token, fetching user info')
            
            userinfo_response = requests.get(
                'https://graph.microsoft.com/v1.0/me',
                headers={'Authorization': f'Bearer {access_token}'}
            )

            if not userinfo_response.ok:
                logger.error(f'User info request failed: {userinfo_response.status_code} - {userinfo_response.text}')
                return Response(
                    {'error': 'Failed to get user info from Microsoft'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            ms_user = userinfo_response.json()

            # Get or create user
            try:
                user, created = User.objects.get_or_create(
                    email=ms_user['userPrincipalName'],
                    defaults={
                        'username': ms_user['userPrincipalName'].split('@')[0],
                        'first_name': ms_user.get('givenName', ''),
                        'last_name': ms_user.get('surname', ''),
                    }
                )
            except Exception as e:
                logger.error(f'Error creating/getting user: {str(e)}')
                return Response(
                    {'error': 'Failed to create user account'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Send welcome email for new users
            if created:
                try:
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
                except Exception as e:
                    logger.warning(f'Failed to send welcome email: {str(e)}')

            # Create or get auth token
            token, _ = Token.objects.get_or_create(user=user)
            
            logger.info(f'Successfully authenticated user: {user.email}')
            
            response_data = {
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'is_new_user': created  # Add flag for new users
            }

            return Response(response_data)

        except Exception as e:
            logger.exception('Unexpected error during Microsoft authentication')
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )