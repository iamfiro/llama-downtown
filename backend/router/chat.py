import json
import os
from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
import ollama

from utils.path import get_path, read_json_file
from entity import chat

router = APIRouter(
    prefix="/chat",
    tags=["ai"],
)

load_dotenv()

@router.post("/chat")
async def chat(chat: chat.ChatUser):
    try:
        chat_file_path = get_path(*(sorted([chat.player1, chat.player2])))
        data  = read_json_file(*(sorted([chat.player1, chat.player2])))

        data.append({
            "role": "system",
            "content": "chat like person. when you recieved null mesage, you must stat chat"
        })
        response = ollama.chat(
            model="llama3.1",
            messages=data,
            options={"temperature": 0.7, "max_tokens": 150,}
        )
        response_content = response["message"]["content"]
        print(response_content)
        data.pop()
        data.append(
        {
            "role": "user",
            "content": response_content
        })


        with open(chat_file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent='\t')

        return {"response": response_content}

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
