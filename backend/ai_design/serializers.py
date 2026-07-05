from rest_framework import serializers
from .models import InteriorDesign


class InteriorDesignSerializer(serializers.ModelSerializer):

    class Meta:
        model = InteriorDesign
        fields = "__all__"