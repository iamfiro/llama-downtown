import json
import os
from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv

from utils.path import get_path

router = APIRouter(
    prefix="/behavior",
    tags=["player"],
)

load_dotenv()


@router.get("/move")
async def create_story():
    try:
        return {"direction": "Move"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


