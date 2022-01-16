import json
from collections import defaultdict

from django.contrib.auth import get_user_model, login, logout
from django.core import serializers
from django.db import IntegrityError
from django.db.models import F
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST, require_GET
# from django.db import IntegrityError

from api.models import Invtypes, Selections
from api.utils.sso import *
from api.utils.user_management import get_or_create_user

User = get_user_model()


@require_GET
def login_user(request):
    # consider generating a random token and saving it in the session instead of relying on session_key
    if not request.session.session_key:
        request.session.create()
        print('created session key for login')
    else:
        print(f'have existing key: {request.session.session_key}')

    # implement generate token method
    # request.session['state'] = 'tempstate'

    scopes = ['esi-characters.read_blueprints.v1']
    auth_endpoint = get_auth_uri(request.session.session_key, scopes)

    return redirect(auth_endpoint)


def callback(request):
    # TODO: add a check to see if the state/session key match
    #  store the refresh token

    if request.session.session_key == request.GET.get('state', ''):
        print('same state')
        print(f'session key: {request.session.session_key} | request key: {request.GET.get("state", "")}')
    else:
        print('different states')
        print(f'session key: {request.session.session_key} | request key: {request.GET.get("state", "")}')
        return redirect('index')

    # pass the auth code in and attempt to get an access token. check for exceptions
    auth_response = submit_auth_code(request.GET['code'])

    decoded_jwt = validate_jwt(auth_response.json()['access_token'])
    owner_hash = decoded_jwt['owner']
    character_id = decoded_jwt['sub']
    character_name = decoded_jwt['name']

    user = get_or_create_user(owner_hash, character_id, character_name)

    if request.user.is_authenticated:
        print('update scopes')
    else:
        login(request, user)

    return redirect('index')


@require_POST
def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        print('logged out')
        return JsonResponse({'detail': 'Successfully logged out.'})

    else:
        print('error: not logged out')
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)


def get_user_blueprints(request):
    if request.user.is_authenticated:
        selections = Selections.objects.filter(user_id=request.user) \
            .values(blueprintID=F('blueprint'),
                    blueprintName=F('blueprint__typename'),
                    blueprintME=F('me'),
                    blueprintTE=F('te'),
                    blueprintRuns=F('runs'),
                    blueprintCopies=F('copies'))
    else:
        # get from session
        selections = []

    return JsonResponse(list(selections), safe=False)


@require_POST
def add_print(request):
    json_data = json.loads(request.body)
    # blueprint = None
    try:
        blueprint = Invtypes.objects.get(typename__exact=json_data['blueprintName'].strip(), published=1,
                                         groupid__categoryid__categoryname__iexact="Blueprint")
        print(blueprint)
    except:
        return JsonResponse({'status': 'Could not find item'}, status=404)

    if request.user.is_authenticated:
        try:
            selection = Selections()
            selection.user = request.user
            selection.blueprint = blueprint
            selection.me = json_data['blueprintME']
            selection.te = json_data['blueprintTE']
            selection.runs = json_data['blueprintRuns']
            selection.copies = json_data['blueprintCopies']
            selection.save()
            print('test')
        # except IntegrityError:
        #     return JsonResponse({'status': 'Item already exists', 'added_print': model_to_dict(blueprint)}, status=409)
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'other error'}, status=404)
    else:
        print('adding to session instead')
    return JsonResponse({'status': 'ok', 'added_print': model_to_dict(blueprint)}, status=200)


def get_materials(request):
    total_mats = defaultdict(int)
    if request.user.is_authenticated:
        selections = Selections.objects.filter(user_id=request.user)
        for i in selections:
            mats = i.blueprint.mats \
                .values('quantity',
                        mat_id=F('materialtypeid__typeid'),
                        mat_name=F('materialtypeid__typename'),
                        group_id=F('materialtypeid__groupid')) \
                .filter(activityid=1, materialtypeid__published=1)

            for mat in mats:
                total_mats[mat['mat_name']] += mat['quantity']
    print(total_mats)

    return JsonResponse(total_mats, safe=False)


@ensure_csrf_cookie
def session_view(request):
    if request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': True})
    print('is not auth')
    return JsonResponse({'isAuthenticated': False})
