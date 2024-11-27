from fastapi import FastAPI
from fastapi_pagination import add_pagination
from .main import router as listner_router

app = FastAPI()
add_pagination(app)
app.include_router(listner_router)


@app.get("/healthcheck", tags=["Utils"])
def healthcheck() -> bool:
    return True
