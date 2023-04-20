from fastapi import APIRouter

import random
import string

router = APIRouter(
    tags=["Create Room URL"],
    prefix="/create_room"
)

@router.get("/url")
def create_room():
    result_str = ''.join(random.choice(string.ascii_letters) for i in range(10))

    url = "http://127.0.0.1:8000/" + result_str

    return {"url": url, "msg":"success"}