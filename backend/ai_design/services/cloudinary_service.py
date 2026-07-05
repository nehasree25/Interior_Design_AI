import cloudinary.uploader


def upload_image(image):
    """Upload a file object (from request.FILES) to Cloudinary."""
    response = cloudinary.uploader.upload(
        image,
        folder="interior_design_ai/originals",
    )
    return response["secure_url"]


def upload_image_from_url(url: str) -> str:
    """
    Upload an image from a remote URL to Cloudinary.
    Used to permanently store Replicate output URLs before they expire.
    """
    response = cloudinary.uploader.upload(
        url,
        folder="interior_design_ai/generated",
    )
    return response["secure_url"]