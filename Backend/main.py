from typing import Union

from fastapi import FastAPI, Path

app = FastAPI()
# instance of FASTAPI object

items = {
    1: {
        "name": "shampoo",
        "price": 400
    }
}


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int = Path(None, description="Put id"), q: Union[str, None] = None):
    return items[item_id]
