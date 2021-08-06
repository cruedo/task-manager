import re
from django.core.signing import JSONSerializer
from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from django.urls import reverse

from django.contrib.auth import authenticate, login as _login, logout as _logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token

from django.core.serializers import serialize as sz

# Create your views here.
# from .models import Question, Choice

from .models import Todlist
import json

def root(request):
    tok = get_token(request)
    d = {1:'fasf', '5':41231, 'fsda':'okoko', 'csrf_token': tok}
    return (JsonResponse(d))

def login(request):
    if(request.method == "POST"):

        try:
            data = json.loads( request.body.decode('utf-8'));
            username = data["username"]
            password = data["password"]
        except:
            username = request.POST["username"]
            password = request.POST["password"]
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            _login(request, user)
            return HttpResponse("This is COOOOOOOL")
        else:
            return HttpResponse("BAD REQUEST", status=401)
    elif(request.method == "GET"):  
        return render(request, "polls/login.html")
    else:
        return HttpResponse("this is a bad request");

def signup(request):
    if(request.method == "POST"):
        data = json.loads(request.body.decode('utf-8'))
        try:
            username = request.POST["username"]
            password1 = request.POST["password1"]
            password2 = request.POST["password2"]
            email = request.POST["email"]
        except:
            username = data["username"]
            password1 = data["password1"]
            password2 = data["password2"]
            email = data["email"]

        if(not username or not email):
            return JsonResponse({'message': "The username or email cannot be empty . Please Sign In Again !"}, status=400)
        if(password1 != password2):
            return JsonResponse({'message': "Please re confirm your password !"}, status=400)
        
        if(User.objects.filter(username=username).exists()):
            return JsonResponse({'message':"User Name Already Exists !"}, status=400)

        user = User(username=username, email=email)
        user.set_password(password1)
        user.save()
        _login(request, user)
        return JsonResponse({'message': 'success'})
        

    elif(request.method == "GET"):
        return render(request, "polls/signup.html")


@login_required(redirect_field_name="goto", login_url="/login/")
def dashboard(request):
    name = request.user.username
    print("00000", request.user.__dict__)
    return HttpResponse(f"This is the dashboard of {request.user} ... !! <br> <a href = '/logout/'>Logout</a>")


def logout(request):
    _logout(request)
    return JsonResponse({'message': 'Successful'})

from rest_framework.response import Response
from .serializer import TodoSerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def list(request):
    if request.user.id is None:
        return JsonResponse({'message': 'Please Login'}, status=401)
    id = request.user.pk
    U = User.objects.get(pk=id)
    q = Todlist.objects.filter(user_id=U)
    res = []
    for i in q:
        d = {  
            'id': i.tuid,
            'done': i.status,
            'desc': i.description,
        }
        res.append(d)

    return JsonResponse({'todos': res})
    # return Response(TodoSerializer(q, many=True).data)

def insert_todo(request):
    if request.user.id is None:
        return JsonResponse({'message': 'Please Login'}, status=401)
    if(request.method == "POST"):
        data = json.loads( request.body.decode('utf-8'))
        U = User.objects.get(pk=request.user.pk)
        message = "successful"

        t = Todlist(description=data['desc'], status=False, user_id=U)
        t.save()
        print(t.pk)

        return JsonResponse({'id': t.pk, 'message': message})
    else:
        return JsonResponse({'data': 'Inaccessible'}, status=404)

def delete_todo(request, id):
    if(request.method == "DELETE"):
        if request.user.id is None:
            return JsonResponse({'message': 'Please Login'}, status=401)
        t = Todlist.objects.get(pk=id)
        status = 200
        try:
            t.delete()
        except:
            status = 500
        return JsonResponse({"data":f"The id is {id}"}, status=status)
    else:
        return JsonResponse({'data': 'Inaccessible'}, status=404)

def pinger(request):
    tok = get_token(request)
    data = {'ok': True, 'csrftoken': tok}

    if request.user.id is None:
        data['ok'] = False
    return JsonResponse(data)

def edit_todo(request):
    if request.user.id is None:
        return JsonResponse({'message': 'Please Login'}, status=401)

    if(request.method == "PUT"):
        data = json.loads(request.body.decode("utf-8"))
        tuid = data['id']
        desc = data['desc']
        t = Todlist.objects.get(pk=tuid)
        t.description = desc
        t.save()
        return JsonResponse({"message": "Success"})
    else:
        return JsonResponse({'data': 'Inaccessible'}, status=404)
    

        
