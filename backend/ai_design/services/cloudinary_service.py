import cloudinary.uploader


def upload_image(image):

    response = cloudinary.uploader.upload(
        image,
        folder="interior_design_ai"
    )

    return response["secure_url"]