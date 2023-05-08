from pydantic import BaseModel
from typing import List

class Room(BaseModel):
    room_id: str
    creator: str
    players: List[str] = []
    score: List[int] = []
    # k xakhabndajb