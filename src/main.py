from fastapi import APIRouter


router = APIRouter()


@router.post("/", tags=["Listner"])
async def stop_solver():
    return 200
