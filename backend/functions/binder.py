from functions import players, chat
import math
import json
from datetime import datetime
from logger import AgentLogger

manager = players.PlayerManager()
logger = AgentLogger()


def calculate_distance(pos1: tuple, pos2: tuple) -> float:
    """Calculate Euclidean distance between two positions"""
    return math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2)


def create_chat_prompt(from_id: int, to_id: int) -> dict:
    """Create a chat prompt structure for two agents"""
    return {
        "content": {
            "from": from_id,
            "to": to_id,
            "message": f"Hello Agent {to_id}, Let's chat!"
        }
    }


def find_close_agents(all_players: dict) -> list:
    """Find pairs of agents that are within distance 2 of each other"""
    close_pairs = []
    player_items = list(all_players.items())

    for i in range(len(player_items)):
        for j in range(i + 1, len(player_items)):
            name1, player1 = player_items[i]
            name2, player2 = player_items[j]

            distance = calculate_distance(player1.pos, player2.pos)

            if distance <= 2:
                close_pairs.append({
                    'pair': (int(name1), int(name2)),
                    'positions': (player1.pos, player2.pos),
                    'distance': round(distance, 2)
                })

    return close_pairs


async def initiate_chat(from_id: int, to_id: int):
    """Initiate a chat between two agents"""
    try:
        prompt = create_chat_prompt(from_id, to_id)
        response = await chat.generate_response(prompt, from_id, to_id)
        logger.log_chat_initiated(from_id, to_id, response.get('distance', 'N/A'))
        return response
    except Exception as e:
        logger.log_error(f"Chat initiation failed: {str(e)}")
        return None


async def tick(agents: int):
    # Initialize tick actions record
    tick_actions = {
        "time": datetime.now().isoformat(),
        "players": []
    }

    # Get all players from the manager
    all_players = manager.get_all_players()

    # Move each player and record their movement
    for player_name in all_players:
        player = all_players[player_name]
        old_pos = player.pos
        await player.move()
        logger.log_movement(int(player_name), old_pos, player.pos)

        # Record movement action
        tick_actions["players"].append({
            "id": int(player_name),
            "state": player.state,
            "location": {
                "x": player.pos[0],
                "y": player.pos[1]
            },
            "action": "move"
        })

    # Find close agents after movement
    close_agents = find_close_agents(all_players)

    # Log system status
    logger.log_system_status(len(all_players), len(close_agents))

    # Initiate chats for close agents and record chat actions
    if close_agents:
        for pair in close_agents:
            from_id, to_id = pair['pair']
            chat_response = await initiate_chat(from_id, to_id)

            if chat_response:
                # Record chat action
                tick_actions["players"].append({
                    "id": from_id,
                    "state": "chat",
                    "location": {
                        "x": all_players[str(from_id)].pos[0],
                        "y": all_players[str(from_id)].pos[1]
                    },
                    "action": "chat",
                    "content": {
                        "from": from_id,
                        "to": to_id,
                        "message": chat_response.get("message", "")
                    }
                })

    return tick_actions