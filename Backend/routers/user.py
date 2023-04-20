from fastapi import APIRouter, Depends, HTTPException, status
from schemas import user_schema
from models import user
from core import database
from sqlalchemy.orm import Session
import numpy as np
from forms import userForm
from typing import List

router = APIRouter(
    tags=['User'],
    prefix="/user"
)

@router.post("/create", status_code=status.HTTP_201_CREATED)
def createUser(form: userForm.UserForm = Depends(), db: Session = Depends(database.get_db)):
    user_info = db.query(user.User).filter(user.User.username == form.username).first()
    
    # if user already does not exits.
    if not user_info:
        new_user = user.User(
            username=form.username, avatar=form.avatar
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    # if user exits and now user has changes their avatar then before.
    else:
        if user_info.avatar != form.avatar:
            update_user = db.query(user.User).filter(user.User.username == form.username)

            update_user.update({"username": form.username, "avatar": form.avatar})
            db.commit()
    
    if not user_info:
        print(new_user)
        user_info = new_user
    else:
        if user_info.avatar != form.avatar:
            user_info = update_user
    
    
    return {"msg": "success", "user_info": user_info}

@router.get("/get_user/{username}")
def getUser(username: str, db: Session = Depends(database.get_db)):
    user_info = db.query(user.User).filter(user.User.username == username).first()

    return {"msg": "success", "user_info": user_info}