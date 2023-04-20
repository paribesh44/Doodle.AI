from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY, Boolean
from core.database import Base
from sqlalchemy.orm import relationship

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String ,nullable=False)
    creator = Column(String, nullable=False)
    players = Column(ARRAY(String), nullable=False)
    score = Column(ARRAY(Integer), nullable=False)
    turn = Column(ARRAY(Boolean), nullable=False)