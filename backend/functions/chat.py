from fastapi import HTTPException
from openai import AsyncOpenAI as OpenAI
from dotenv import load_dotenv
import json
import os


from functions import save

load_dotenv()

ai = OpenAI()
ai.api_key = os.getenv("OPENAI_API_KEY")


def get_chat_history(from_id: int, to_id: int) -> list:
    """Fetch previous chat history between two agents"""
    try:
        # Sort IDs to match the file naming convention
        player_ids = sorted([from_id, to_id])
        filename = f"chat_logs/chat_{player_ids[0]}_{player_ids[1]}.json"

        if not os.path.exists(filename):
            return []

        with open(filename, 'r', encoding='utf-8') as f:
            chat_data = json.load(f)

        # Extract previous messages in chronological order
        history = []
        for player in chat_data.get('players', []):
            if 'content' in player and isinstance(player['content'], dict):
                history.append({
                    'role': 'user' if player['id'] == from_id else 'assistant',
                    'content': player['content'].get('message', '')
                })

        return history
    except Exception as e:
        print(f"Error reading chat history: {str(e)}")
        return []


async def generate_response(prompt: dict, start: int, to: int):
    try:
        user_message = prompt["content"]["message"]

        # Get previous chat history
        chat_history = get_chat_history(start, to)

        # Prepare messages for the API
        messages = []

        # Add chat history
        messages.extend(chat_history)

        # Add current message
        messages.append({
            "role": "user",
            "content": user_message
        })
        print(messages)
        chat = await ai.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            messages=messages,
            temperature=0.7,
            max_tokens=150,
        )
        ai_response = chat.choices[0].message.content

        # Save structure
        save_structure = {
            "content": {
                "from": start,
                "to": to,
                "message": ai_response
            }
        }

        # Save
        json_response = json.dumps(save_structure, ensure_ascii=False)
        save.save(start, to, json_response)

        return {
            "to": to,
            "message": ai_response
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))