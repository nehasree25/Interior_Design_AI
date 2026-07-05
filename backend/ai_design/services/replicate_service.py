import replicate
from decouple import config


replicate_client = replicate.Client(
    api_token=config("REPLICATE_API_TOKEN")
)


def generate_ai_design(image_url: str, prompt: str) -> str:
    """
    Generate an AI-redesigned interior image using Flux Kontext Pro.
    Returns a URL string of the generated image.
    """
    output = replicate_client.run(
        "black-forest-labs/flux-kontext-pro",
        input={
            "prompt": prompt,
            "input_image": image_url,
        }
    )

    # output is a FileOutput object; convert to string to get the URL
    if isinstance(output, list):
        return str(output[0])
    return str(output)
