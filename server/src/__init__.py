import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi_pagination import add_pagination
from sqlmodel import create_engine

from src.fistula import FistulaAnalyzer
from .main import router as listner_router

DBURL = os.getenv("DBURL")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if DBURL is None:
        raise Exception("Invalid env")
    app.state.analyzer = FistulaAnalyzer()
    app.state.engine = create_engine(DBURL)
    yield


app = FastAPI(lifespan=lifespan)
add_pagination(app)
app.include_router(listner_router)


@app.get("/healthcheck", tags=["Utils"])
def healthcheck() -> bool:
    return True
