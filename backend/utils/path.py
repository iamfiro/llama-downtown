import os
import json


directory_path = "save_directory"

def get_path(player1: int, player2: int):
    """Get the path for the chat history file and create if it doesn't exist"""
    path = os.path.join(directory_path, f"{player1}_{player2}.json")
    if not os.path.exists(path):
        with open(path, 'w', encoding="utf-8") as file:
            json.dump([], file, ensure_ascii=False)
    return path

def read_json_file(player1: int, player2: int):
    """Read and return the chat history from json file"""
    path = get_path(player1, player2)
    try:
        with open(path, 'r', encoding="utf-8") as file:
            content = file.read()
            return json.loads(content) if content else []
    except json.JSONDecodeError:
        return []
