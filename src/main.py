from fastapi import APIRouter, Request


router = APIRouter()


@router.post("/", tags=["Listner"])
async def post_data(request: Request):
    return 200
