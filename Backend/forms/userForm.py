from fastapi import File, UploadFile, Form
from typing import List, Optional

class UserForm:
    def __init__(
        self,
        username: str = Form(...),
        avatar: str = Form(...)
    ):
        self.username = username
        self.avatar = avatar