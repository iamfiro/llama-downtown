from functions import players, chat
import math
import json
from datetime import datetime

manager = players.PlayerManager()


def calculate_distance(pos1: tuple, pos2: tuple) -> float:
    """Calculate Euclidean distance between two positions"""
    return math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2)


def create_chat_prompt(from_id: int, to_id: int) -> dict:
    """Create a chat prompt structure for two agents"""
    return {
        "time": datetime.now().isoformat(),
        "players": [
            {
                "id": from_id,
                "state": "chat",
                "action": "chat",
                "content": [
                    {
                        "to": to_id,
                        "message": f"Hello Agent {to_id}, I noticed you're nearby. How are you doing?"
                    }
                ]
            }
        ]
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
                    'pair': (int(name1), int(name2)),  # Convert to int for use as IDs
                    'positions': (player1.pos, player2.pos),
                    'distance': round(distance, 2)
                })

    return close_pairs


async def initiate_chat(from_id: int, to_id: int):
    """Initiate a chat between two agents"""
    try:
        prompt = create_chat_prompt(from_id, to_id)
        response = await chat.generate_response(prompt, from_id, to_id)
        print(f"\nChat initiated between Agent {from_id} and Agent {to_id}")
        print(f"Response: {response}")
        return response
    except Exception as e:
        print(f"Error initiating chat: {str(e)}")
        return None


async def tick(agents: int):
    all_players = manager.get_all_players()

    for player_name in all_players:
        player = all_players[player_name]
        await player.move()

    close_agents = find_close_agents(all_players)

    if close_agents:
        print("\nClose agents detected:")
        for pair in close_agents:
            print(f"Agents {pair['pair']} are {pair['distance']} units apart at positions {pair['positions']}")
            from_id, to_id = pair['pair']
            await initiate_chat(from_id, to_id)