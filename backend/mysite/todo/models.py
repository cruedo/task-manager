from django.db import models

from django.utils import timezone
from django.contrib.auth.models import User
# Create your models here.

# class User(models.Model):
#     uid = models.IntegerField(primary_key=True)
#     user_name = models.CharField(max_length=200, )
#     email = models.EmailField(unique=True, null=False)
#     password = models.CharField(max_length=350 ,null=False)

#     def __str__(self):
#         return self.user_name
    

class Todlist(models.Model):
    tuid = models.AutoField(primary_key=True)
    description = models.CharField(max_length=350, null=False)
    status = models.BooleanField(default=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.description