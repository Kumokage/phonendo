import os
import io
import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Header, Response
from fastapi_pagination import Page, paginate
from typing import Annotated
from pydantic import BaseModel
from minio import Minio
from minio.error import S3Error


router = APIRouter()


class PhonendoParams(BaseModel):
    pacient_id: int
    doctor_id: int
    bodie: str
    date: str
    time: str
    record_name: str
    volume: float
    sign_id: float
    sign_level: float
    conclusion: str


class PhonendoData(BaseModel):
    phonendoId: str
    base64Record: str
    recordName: str
    usageDate: datetime
    recordType: str
    params: PhonendoParams


XAPIKey = os.getenv("XAPIKey")
access_key = os.getenv("MINIO_SERVER_ACCESS_KEY")
secret_key = os.getenv("MINIO_SERVER_SECRET_KEY")


@router.post(
    "/",
    tags=["Listner"],
    responses={
        500: {"description": "Internal error"},
        400: {"description": "Faild to save file"},
        401: {"description": "Authentification error"},
        200: {"description": "Successfully save file"},
    },
)
async def post_data(
    data: PhonendoData,
    X_API_Key: Annotated[str | None, Header()] = None,
    # X_PIN_Key: Annotated[str | None, Header()] = None,
):
    if X_API_Key != XAPIKey:
        return Response(status_code=401)
    try:
        client = Minio(
            "minio:9000", access_key=access_key, secret_key=secret_key, secure=False
        )
        bucket_name = "phonendo-data"
        destination_file = f"{uuid.uuid4()}.json"

        found = client.bucket_exists(bucket_name)
        if not found:
            client.make_bucket(bucket_name)

        value = json.dumps(data.model_dump(), default=str)
        value_as_bytes = value.encode("utf-8")
        value_as_a_stream = io.BytesIO(value_as_bytes)
        client.put_object(
            bucket_name, destination_file, value_as_a_stream, length=len(value_as_bytes)
        )
    except S3Error as e:
        print("Error:", e)
        return Response(status_code=400)
    return Response(status_code=200)


@router.get(
    "/phonendo/phonendo-record-get",
    tags=["Accesser"],
    responses={
        500: {"description": "Internal error"},
        400: {"description": "Faild to fiend data"},
        401: {"description": "Authentification error"},
        200: {"description": "Successfully save file", "model": PhonendoData},
    },
    response_model=PhonendoData,
)
async def get_data(
    id: str,
    X_API_Key: Annotated[str | None, Header()] = None,
):
    if X_API_Key != XAPIKey:
        return Response(status_code=401)
    try:
        client = Minio(
            "minio:9000", access_key=access_key, secret_key=secret_key, secure=False
        )
        bucket_name = "phonendo-data"
        obj = client.get_object(bucket_name, f"{id}.json")
        data = json.loads(obj.data.decode())
        return PhonendoData.model_validate(data)
    except S3Error as e:
        print("Error:", e)
        return Response(status_code=400)


@router.get(
    "/phonendo/phonendo-record-getall",
    tags=["Accesser"],
    responses={
        500: {"description": "Internal error"},
        400: {"description": "Faild to fiend data"},
        401: {"description": "Authentification error"},
        200: {"description": "Successfully save file", "model": Page[PhonendoData]},
    },
    response_model=Page[PhonendoData],
)
async def getall_data(
    X_API_Key: Annotated[str | None, Header()] = None,
):
    if X_API_Key != XAPIKey:
        return Response(status_code=401)
    try:
        client = Minio(
            "minio:9000", access_key=access_key, secret_key=secret_key, secure=False
        )
        bucket_name = "phonendo-data"
        objects = client.list_objects(bucket_name)
        files = []
        for obj in objects:
            if obj.object_name:
                res = client.get_object(bucket_name, obj.object_name)
                data = json.loads(res.data.decode())
                files.append(PhonendoData.model_validate(data))
        return paginate(files)
    except S3Error as e:
        print("Error:", e)
        return Response(status_code=400)
