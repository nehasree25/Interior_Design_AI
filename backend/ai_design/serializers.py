from rest_framework import serializers
from .models import InteriorDesign


class InteriorDesignSerializer(serializers.ModelSerializer):
    """
    Serializer for InteriorDesign.
    Excludes the internal `user` FK — callers are already authenticated
    and the frontend has no use for the raw user ID in API responses.
    """

    class Meta:
        model = InteriorDesign
        fields = ['id', 'original_image', 'generated_image', 'prompt', 'created_at']
        read_only_fields = fields
