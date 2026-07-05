from django.db import models
from django.conf import settings


class InteriorDesign(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    original_image = models.URLField()

    generated_image = models.URLField(
        blank=True,
        null=True
    )

    prompt = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user} - {self.prompt}"