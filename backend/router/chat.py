import json
import os
from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
import ollama

from utils.path import get_path
from entity import chat

router = APIRouter(
    prefix="/chat",
    tags=["ai"],
)

load_dotenv()

@router.post("/chat")
async def chat(chat: chat.ChatUser):
    try:
        player1 = chat.player1
        player2 = chat.player2
        if chat.player1 > chat.player2:
            player1 = chat.player2
            player2 = chat.player1

        chat_file_path = get_path(player1 + player2)

        with open(chat_file_path, "r") as f:
            data = json.load(f)

            response = ollama.chat(
                model="llama3.1",
                message=data,
                options={"temperature": 0.7, "max_tokens": 300,}
            )
            response_content = response["message"]["content"]

        data.append({
            "role": "assistant",
            "content": response_content
        })

        with open(chat_file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent='\t')

        return {"response": response_content}

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
