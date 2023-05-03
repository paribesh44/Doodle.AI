import json
from utils.populatedata import (users)
from models import user
from core import database

db = database.SessionLocal()

created_users = []
def populate_user():
    for user_populate in users:
        print(f"Populating user: {user_populate}")
        new_user = user.User(username=user_populate["username"], avatar=user_populate["avatar"])
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

def populate_all():
    populate_user()