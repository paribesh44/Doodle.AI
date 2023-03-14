from typing import Union, Optional

from fastapi import FastAPI, Path

from pydantic import BaseModel

app = FastAPI()
# instance of FASTAPI object

items = {
    1: {
        "name": "shampoo",
        "price": 400
    }
}


class Blog (BaseModel):
    title: str
    body: str
    puglished_at: Optional[bool]


@app.post('/blog')
def create_blog(request: Blog):
    return {'data': f"blog is created with {request.title }"}


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int = Path(None, description="Put id"), q: Union[str, None] = None):
    return items[item_id]
