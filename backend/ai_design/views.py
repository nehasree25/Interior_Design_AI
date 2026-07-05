from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import InteriorDesign
from .serializers import InteriorDesignSerializer

from .services.cloudinary_service import upload_image
from .services.replicate_service import generate_ai_design


class GenerateDesignView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):

        image = request.FILES.get("image")
        prompt = request.data.get("prompt")

        if not image:
            return Response(
                {"error": "Image is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not prompt:
            return Response(
                {"error": "Prompt is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Upload to Cloudinary
            original_image_url = upload_image(image)

            # Generate AI image
            generated_image_url = generate_ai_design(
                original_image_url,
                prompt
            )

            # Save to DB
            design = InteriorDesign.objects.create(
                user=request.user,
                original_image=original_image_url,
                generated_image=generated_image_url,
                prompt=prompt
            )

            serializer = InteriorDesignSerializer(design)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )