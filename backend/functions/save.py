import json
import os
from fastapi import HTTPException


def save(start: int, to: int, json_response: str):
    """
    Save chat messages between players to a file.

    Args:
        start (int): ID of the player who started the chat
        to (int): ID of the player who receives the message
        json_response (str): JSON string containing the chat message data

    Raises:
        HTTPException: If there's an error saving the chat
    """
    try:
        # Create a directory for chat logs if it doesn't exist
        os.makedirs('chat_logs', exist_ok=True)

        # Generate filename using player IDs
        filename = f"chat_logs/chat_{start}_to_{to}.json"

        # Parse the JSON string to ensure it's valid
        chat_data = json.loads(json_response)

        # Add metadata to the chat data
        chat_data['metadata'] = {
            'from_player': start,
            'to_player': to,
            'filename': filename
        }

        # Write to file with proper formatting
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(chat_data, f, ensure_ascii=False, indent=2)

        return filename

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
    except IOError as e:
        raise HTTPException(status_code=500, detail=f"Failed to save chat: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")