import io
import json
import os
import uuid
from datetime import datetime
from typing import Annotated, Optional

from fastapi import APIRouter, Header, Request, Response
from fastapi_pagination import Page, paginate
from fastapi_pagination.utils import disable_installed_extensions_check
from minio import Minio
from minio.error import S3Error
from pydantic import BaseModel
from sqlalchemy import exc
from sqlalchemy.engine import Engine
from sqlmodel import Field, Session, SQLModel

from src.fistula import FistulaAnalyzer

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
    history_id: Optional[str] = None


class PhonendoData(BaseModel):
    phonendoId: str
    base64Record: str
    recordName: str
    usageDate: datetime
    recordType: str
    params: PhonendoParams


class JournalRecord(SQLModel, table=True):
    __tablename__ = "JournalRecord"  # type: ignore
    __table_args__ = {"extend_existing": True}
    id: str = Field(default=None, primary_key=True)
    bodie: str
    date: str
    time: str
    record_name: str
    volume: float
    sign_id: float
    sign_level: float
    conclusion: str
    history_id: Optional[str] = None
    phonendoId: str
    recordName: str
    usageDate: datetime
    recordType: str
    ml_result: float
    patient_id: int
    doctor_id: int


XAPIKey = os.getenv("XAPIKey")
access_key = os.getenv("MINIO_SERVER_ACCESS_KEY")
secret_key = os.getenv("MINIO_SERVER_SECRET_KEY")


def save_to_db(
    engine: Engine, analyzer: FistulaAnalyzer, data: PhonendoData, id: uuid.UUID
):
    try:
        ml_result = analyzer.analyze(data.model_dump())
        new_record = JournalRecord(
            id=str(id),
            bodie=data.params.bodie,
            date=data.params.date,
            time=data.params.time,
            record_name=data.params.record_name,
            volume=data.params.volume,
            sign_id=data.params.sign_id,
            sign_level=data.params.sign_level,
            conclusion=data.params.conclusion,
            history_id=data.params.history_id,
            phonendoId=data.phonendoId,
            recordName=data.recordName,
            usageDate=data.usageDate,
            recordType=data.recordType,
            ml_result=ml_result,
            patient_id=data.params.pacient_id,
            doctor_id=data.params.doctor_id,
        )
        with Session(engine) as session:
            session.add(new_record)
            session.commit()
    except exc.SQLAlchemyError as e:
        print(e)
    except Exception as e:
        print(e)


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
    request: Request,
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
        id = uuid.uuid4()
        destination_file = f"{id}.json"

        found = client.bucket_exists(bucket_name)
        if not found:
            client.make_bucket(bucket_name)

        value = json.dumps(data.model_dump(), default=str)
        value_as_bytes = value.encode("utf-8")
        value_as_a_stream = io.BytesIO(value_as_bytes)
        client.put_object(
            bucket_name, destination_file, value_as_a_stream, length=len(value_as_bytes)
        )
        save_to_db(request.app.state.engine, request.app.state.analyzer, data, id)
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
    request: Request,
    try_to_save: bool = False,
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
        names = []
        for obj in objects:
            if obj.object_name:
                res = client.get_object(bucket_name, obj.object_name)
                data = json.loads(res.data.decode())
                names.append(obj.object_name.split(".")[0])
                files.append(PhonendoData.model_validate(data))

        if try_to_save:
            for data, id in zip(files, names):
                print(id)
                save_to_db(
                    request.app.state.engine, request.app.state.analyzer, data, id
                )
        disable_installed_extensions_check()
        return paginate(files)
    except S3Error as e:
        print("Error:", e)
        return Response(status_code=400)
