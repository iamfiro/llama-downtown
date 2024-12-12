from functions import players
from typing import List, Dict
import random
import math
import asyncio

import binder


class AgentInitializer:
    def __init__(self, num_agents: int = 4):
        self.num_agents = num_agents

    def initialize_agents(self, manager: players.PlayerManager) -> Dict[int, tuple]:
        """Initialize agents with random positions and add them to the manager"""
        positions = {}

        for i in range(self.num_agents):
            # Generate unique position
            while True:
                pos = self._generate_random_position()
                if pos not in positions.values():
                    break

            # Add player to manager
            player_name = str(i)  # Using index as name as shown in return example
            manager.add_player(player_name, pos)
            positions[i] = pos

        return positions




async def main():

    # Create initializer and add agents
    initializer = AgentInitializer()
    positions = initializer.initialize_agents(binder.manager)

    # Print initial state for verification
    print("Initialized agents with positions:")
    for player_id, pos in positions.items():
        print(f"Agent {player_id}: position {pos}")

    while True:
        await binder.tick(agents = 4)
        await asyncio.sleep(1)



if __name__ == "__main__":
    asyncio.run(main())