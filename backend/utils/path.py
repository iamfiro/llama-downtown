import os
import json

directory_path = "save_directory"

def get_path(player1: int, player2: int):
    path = os.path.join(directory_path, f"{player1}_{player2}.json")
    if not os.path.exists(path):
        with open(path, 'w') as file:
            file.write(json.dumps([]))
    return path

def read_json_file(player1: int, player2: int):
    path = get_path(player1, player2)
    with open(path, 'r') as file:
        content = file.read()
        if content:
            return json.loads(content)
        else:
            return []