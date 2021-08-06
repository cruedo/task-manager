from rest_framework import serializers
from .models import Todlist

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todlist
        fields = '__all__'
