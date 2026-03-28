import os
import uuid
from django.conf import settings
from django.db import models

class CustomFileBaseField:
    def __init__(self, *args, **kwargs):
        # Set a custom path based on the field name
        kwargs['upload_to'] = self.get_upload_path
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        # Call the parent class's deconstruct method to get the basic information
        name, path, args, kwargs = super().deconstruct()

        # Avoid unnecessary migrations if the upload_to is unchanged
        if kwargs.get('upload_to') == self.get_upload_path:
            del kwargs['upload_to']  # Remove the argument if it's the default to avoid migration changes

        return name, path, args, kwargs

    def get_upload_path(self, instance, filename):
        field_name = self.name
        model_name = instance.__class__.__name__.lower()
        unique_filename = f"{uuid.uuid4()}.{filename.split('.')[-1]}"
        return os.path.join(f'{model_name}/{field_name}', unique_filename)


class CustomImageField(CustomFileBaseField, models.ImageField):
    """
    A custom ImageField that uses the same logic as CustomFileBaseField.
    """
    pass


class CustomFileField(CustomFileBaseField, models.FileField):
    """
    A custom FileField that uses the same logic as CustomFileBaseField.
    """
    pass


def get_file_extension(filename):
    return filename.split('.')[-1].lower()

def is_accepted_image_type(file_name):
    return get_file_extension(file_name) in settings.ALLOWED_IMAGE_FILE_EXTENSIONS
