from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Any

from sqlalchemy.ext.declarative import as_declarative, declared_attr


SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:password@localhost:5432/doodle'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@as_declarative()
class Base:
    id: Any
    __name__: str
    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
