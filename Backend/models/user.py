from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, ARRAY
from core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    avatar = Column(String, nullable=False)
