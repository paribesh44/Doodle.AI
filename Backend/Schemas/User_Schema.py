from pydantic import BaseModel


class User (BaseModel):
    user_name: str
    user_id: int
