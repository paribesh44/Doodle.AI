from fastapi import File, UploadFile, Form
from typing import List, Optional

class RoomForm:
    def __init__(
        self,
        room_id: str = Form(...),
        creator: str = Form(...),
        players: Optional[List[str]] = Form(None),
        score: Optional[List[int]] = Form(None),
        state: str = Form(...)

        self.room_id = room_id
        self.creator = creator
        self.players = players
        self.score = score
        self.state = state
