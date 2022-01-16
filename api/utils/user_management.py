from api.models import User


def get_or_create_user(owner_hash, character_id, character_name):
    try:
        # try to find the user with these credentials
        user = User.objects.get(owner_hash=owner_hash, character_id=character_id)
        print("got old user")
    except User.DoesNotExist:
        # if not found try to find a user using just the character id. if found it means owner hash changed so delete
        # the old user. create a new user and use that
        try:
            user = User.objects.get(character_id=character_id)
            user.delete()
            print('deleted and created new user')
            user = User.objects.create(owner_hash=owner_hash, character_id=character_id)
        except User.DoesNotExist:
            # if user is still not found then create a user
            user = User.objects.create(owner_hash=owner_hash, character_id=character_id, character_name=character_name)
            print("created brand new user")
    return user
