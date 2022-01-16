# refactor login and callback to make use of this file
import base64
import os
import sys
import urllib.parse
import urllib.request
from pprint import pprint

import requests
from dotenv import load_dotenv
from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTError, JWTClaimsError

load_dotenv()


# get the uri to redirect the user to the login page
def get_auth_uri(state, scopes=[]):
    auth_url = 'https://login.eveonline.com/v2/oauth/authorize/?'

    # convert the list into a string later. use some default scopes for now
    # scopes = ""
    params = {
        'response_type': 'code',
        'redirect_uri': 'http://localhost:8000/api/callback/',
        'client_id': os.environ.get('EVE_CLIENT_ID', ''),
        # 'scope': 'esi-characters.read_blueprints.v1 esi-industry.read_corporation_jobs.v1',
        'scope': '',
        'state': state
    }
    params_encoded = urllib.parse.urlencode(params, quote_via=urllib.parse.quote)

    return auth_url + params_encoded


# submits the authorization code to the token endpoint to get an access and refresh token
def submit_auth_code(auth_code):
    token_url = 'https://login.eveonline.com/v2/oauth/token'

    credentials = os.environ.get('EVE_CLIENT_ID', '') + ':' + os.environ.get('EVE_SECRET_KEY', '')
    credentials_encoded = base64.urlsafe_b64encode(credentials.encode('utf-8')).decode()
    headers = {
        'Authorization': f'Basic {credentials_encoded}',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'login.eveonline.com',
    }
    data = {
        'grant_type': 'authorization_code',
        'code': auth_code
    }

    response = requests.post(token_url, headers=headers, data=data)
    # check if response code is 200 else raise exception
    # if code is not 200, return _, false for auth_response, status

    return response


def validate_jwt(token):
    """Validates the JWT and decodes it"""

    jwk_set_url = "https://login.eveonline.com/oauth/jwks"

    res = requests.get(jwk_set_url)
    res.raise_for_status()

    data = res.json()

    # TODO: validate things such as expiry date
    try:
        jwk_sets = data["keys"]
    except KeyError as e:
        print("Something went wrong when retrieving the JWK set. The returned "
              "payload did not have the expected key {}. \nPayload returned "
              "from the SSO looks like: {}".format(e, data))
        sys.exit(1)

    jwk_set = next((item for item in jwk_sets if item["alg"] == "RS256"))

    # TODO: look at code from https://github.com/esi/esi-docs/blob/master/examples/python/sso/validate_jwt.py
    data = jwt.decode(
        token,
        jwk_set,
        algorithms=jwk_set["alg"],
        issuer="login.eveonline.com"
    )

    # pprint(data)
    return data


def send_request():
    pass
