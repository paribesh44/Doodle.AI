from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, ARRAY
from core.database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_type = Column(String, nullable=False)
