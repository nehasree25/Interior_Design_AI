import replicate
from decouple import config


replicate_client = replicate.Client(
    api_token=config("REPLICATE_API_TOKEN")
)


def generate_ai_design(image_url, prompt):

    output = replicate_client.run(
        "black-forest-labs/flux-kontext-pro",
        input={
            "prompt": prompt,
            "input_image": image_url
        }
    )

    return output