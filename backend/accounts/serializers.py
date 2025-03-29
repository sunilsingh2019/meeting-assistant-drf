from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserPreferences

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        try:
            # Create user instance
            user = User(
                username=validated_data['email'].split('@')[0],  # Generate username from email
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                is_active=True  # Make sure user is active
            )
            # Set the password
            user.set_password(validated_data['password'])
            # Save the user
            user.save()
            return user
        except Exception as e:
            raise serializers.ValidationError(f"Error creating user: {str(e)}")

class LoginSerializer(serializers.Serializer):
    login = serializers.EmailField(required=True)  # Change to EmailField
    password = serializers.CharField(required=True, write_only=True)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True, validators=[validate_password])
    password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = [
            'working_hours_start',
            'working_hours_end',
            'work_days',
            'preferred_meeting_duration',
            'has_completed_onboarding'
        ]
        read_only_fields = ['has_completed_onboarding']

class MeSerializer(serializers.ModelSerializer):
    has_completed_onboarding = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'has_completed_onboarding')

    def get_has_completed_onboarding(self, obj):
        try:
            return obj.preferences.has_completed_onboarding
        except UserPreferences.DoesNotExist:
            return False