from django.http import JsonResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .gmail_backend import GmailOAuth2Backend

class GmailOAuthURLView(APIView):
    def get(self, request):
        try:
            auth_url = GmailOAuth2Backend.get_oauth_url()
            return Response({'auth_url': auth_url})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GmailOAuthCallbackView(APIView):
    def post(self, request):
        try:
            code = request.data.get('code')
            if not code:
                return Response(
                    {'error': 'Authorization code is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            GmailOAuth2Backend.handle_oauth_callback(code)
            return Response({'message': 'Gmail authentication successful'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 