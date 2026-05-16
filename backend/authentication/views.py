from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate, get_user_model
from .serializers import (
    UserSignupSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserUpdateSerializer
)

User = get_user_model()


class UserSignupView(generics.CreateAPIView):
    """API endpoint for user registration."""
    
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSignupSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'success': True,
                'message': 'User registered successfully',
                'data': {
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                        'created_at': user.created_at
                    },
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    }
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Registration failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """API endpoint for user login."""
    
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Authenticate user
            user = authenticate(request, email=email, password=password)
            
            if user is not None:
                if user.is_active:
                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)
                    
                    return Response({
                        'success': True,
                        'message': 'Login successful',
                        'data': {
                            'user': {
                                'id': user.id,
                                'email': user.email,
                                'name': user.name,
                                'created_at': user.created_at
                            },
                            'tokens': {
                                'access': str(refresh.access_token),
                                'refresh': str(refresh)
                            }
                        }
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'success': False,
                        'message': 'Account is disabled'
                    }, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                    'success': False,
                    'message': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'success': False,
            'message': 'Invalid input',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """API endpoint for retrieving and updating user profile."""
    
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer
    
    def get_object(self):
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'message': 'Profile retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UserUpdateSerializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            profile_serializer = UserProfileSerializer(instance)
            
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'data': profile_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Update failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    """API endpoint for user logout."""
    
    permission_classes = (IsAuthenticated,)
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'success': True,
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Logout failed',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    """Custom token refresh view with standardized response."""
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            return Response({
                'success': True,
                'message': 'Token refreshed successfully',
                'data': {
                    'access': response.data.get('access')
                }
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Token refresh failed',
            'errors': response.data
        }, status=response.status_code)
