from fastapi import FastAPI
from .main import router as listner_router

app = FastAPI()
app.include_router(listner_router)


@app.get("/healthcheck", tags=["Utils"])
def healthcheck() -> bool:
    return True
