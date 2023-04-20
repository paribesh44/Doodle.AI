from fastapi import FastAPI, Path
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.cors import CORSMiddleware

from routers import (room_url, user, room, room_websocket, game)

app = FastAPI()

SECRET_KEY = "KWn54X_xI9xAOc1c6AWDAwD-JMURBTjhYBkdIJaH"

origins = [
    "http://localhost:3000"
]
# SessionMiddleware, secret_key=SECRET_KEY

app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY
)

# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user.router)
app.include_router(room.router)
app.include_router(room_websocket.router)
app.include_router(game.router)
app.include_router(room_url.router)
