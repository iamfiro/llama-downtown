from functions import players
from functions import move
from typing import List, Dict
import random
import math
import asyncio
import binder

class AgentInitializer:
    def __init__(self, num_agents: int = 4):
        self.num_agents = num_agents

    async def initialize_agents(self, manager: players.PlayerManager) -> Dict[int, tuple]:
        """Initialize agents with positions using move function and add them to the manager"""
        positions = {}

        for i in range(self.num_agents):
            # Generate unique position using move function
            while True:
                # Start from (0,0) and let move function generate valid position
                new_pos = await move.move((0, 0))
                if new_pos not in positions.values():
                    break

            # Add player to manager
            player_name = str(i)
            manager.add_player(player_name, new_pos)
            positions[i] = new_pos

        return positions


async def main():
    # Create initializer and add agents
    initializer = AgentInitializer()
    positions = await initializer.initialize_agents(binder.manager)

    # Print initial state for verification
    print("Initialized agents with positions:")
    for player_id, pos in positions.items():
        print(f"Agent {player_id}: position {pos}")

    while True:
        await binder.tick(agents=4)
        await asyncio.sleep(1)


if __name__ == "__main__":
    asyncio.run(main())