"""Decode and resize a profile photo before storing it."""
from io import BytesIO

from PIL import Image, ImageOps, UnidentifiedImageError


MAX_PHOTO_BYTES = 5 * 1024 * 1024
MAX_PHOTO_PIXELS = 20_000_000
PHOTO_FORMATS = ("JPEG", "PNG", "WEBP")


def prepare_profile_photo(upload):
    original = upload.stream.read(MAX_PHOTO_BYTES + 1)
    if not original or len(original) > MAX_PHOTO_BYTES:
        raise ValueError("La foto debe ocupar como máximo 5 MB.")

    try:
        with Image.open(BytesIO(original), formats=PHOTO_FORMATS) as image:
            if image.width * image.height > MAX_PHOTO_PIXELS:
                raise ValueError("La foto debe tener como máximo 20 megapíxeles.")

            photo = ImageOps.exif_transpose(image)
            photo.thumbnail((384, 384))

            # Flatten transparent images and write only the image pixels to JPEG.
            rgba = photo.convert("RGBA")
            result = Image.new("RGB", rgba.size, "white")
            result.paste(rgba, mask=rgba.getchannel("A"))
            output = BytesIO()
            result.save(output, format="JPEG", quality=82, optimize=True)
            return output.getvalue()
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError, SyntaxError) as error:
        raise ValueError("El archivo debe ser una imagen JPG, PNG o WebP válida.") from error
