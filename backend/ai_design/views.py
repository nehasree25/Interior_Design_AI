from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from .models import InteriorDesign
from .serializers import InteriorDesignSerializer
from .services.cloudinary_service import upload_image, upload_image_from_url
from .services.replicate_service import generate_ai_design


class GenerateDesignView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        image = request.FILES.get("image")
        prompt = request.data.get("prompt", "").strip()

        if not image:
            return Response(
                {"error": "Image is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not prompt:
            return Response(
                {"error": "Prompt is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Upload original image to Cloudinary
            original_image_url = upload_image(image)

            # Generate AI redesign via Replicate (returns a temporary URL)
            replicate_url = generate_ai_design(original_image_url, prompt)

            # Re-upload the generated image to Cloudinary for permanent storage.
            # Replicate delivery URLs expire — without this step, history images
            # go blank after ~1 hour.
            generated_image_url = upload_image_from_url(replicate_url)

            # Persist to database
            design = InteriorDesign.objects.create(
                user=request.user,
                original_image=original_image_url,
                generated_image=generated_image_url,
                prompt=prompt,
            )

            serializer = InteriorDesignSerializer(design)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DesignHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        designs = (
            InteriorDesign.objects.filter(user=request.user)
            .order_by("-created_at")
        )
        serializer = InteriorDesignSerializer(designs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
