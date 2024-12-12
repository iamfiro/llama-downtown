import json
import os
from fastapi import HTTPException


def save(start: int, to: int, json_response: str):
    """
    Save chat messages between players to a file, consolidating chats between the same players.

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

        # Sort the player IDs to ensure consistent filename regardless of who started the chat
        player_ids = sorted([start, to])
        filename = f"chat_logs/chat_{player_ids[0]}_{player_ids[1]}.json"

        # Initialize chat history
        chat_history = {}

        # Load existing chat history if it exists
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                chat_history = json.load(f)

        # Parse the new chat data
        new_chat_data = json.loads(json_response)

        # If chat_history is empty, initialize it with the new chat data
        if not chat_history:
            chat_history = new_chat_data
        else:
            # Append new content to existing chat history
            chat_history['time'] = new_chat_data['time']  # Update timestamp
            # Merge players' content
            for new_player in new_chat_data['players']:
                player_exists = False
                for existing_player in chat_history['players']:
                    if existing_player['id'] == new_player['id']:
                        existing_player['state'] = new_player['state']
                        existing_player['action'] = new_player['action']
                        existing_player['content'].extend(new_player['content'])
                        player_exists = True
                        break
                if not player_exists:
                    chat_history['players'].append(new_player)

        # Add metadata
        chat_history['metadata'] = {
            'participants': player_ids,
            'filename': filename
        }

        # Write updated chat history to file
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(chat_history, f, ensure_ascii=False, indent=2)

        return filename

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
    except IOError as e:
        raise HTTPException(status_code=500, detail=f"Failed to save chat: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")