from pydantic import BaseModel
from typing import List

class User(BaseModel):
    username: str
    avatar: str