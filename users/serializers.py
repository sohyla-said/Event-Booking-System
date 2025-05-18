from rest_framework import serializers
from .models import User, Events, Booking
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email as django_validate_email
from django.core.exceptions import ValidationError as DjangoValidationError



# Register serializer for user registration
# Defining what fields can be received
# Validating data (checking password strength)
# Creating the new user object
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["name", "email", "password","confirm_password", "is_admin", "is_user"]
    
    def validate(self, data):
        
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")

        if len(data['password']) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        # Email validation and uniqueness
        try:
            django_validate_email(data['email'])
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email is already in use")

        return data

    def create(self, validated_data):
        user = User.objects.create(
            name = validated_data["name"],
            email=validated_data["email"],
            is_admin=validated_data.get("is_admin", False),
            is_user=validated_data.get("is_user", True)
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = ['id', 'name', 'description', 'date', 'category', 'venue', 'price', 'image']
    