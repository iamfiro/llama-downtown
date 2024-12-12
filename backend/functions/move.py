from random import randint
from fastapi import HTTPException


async def move(pos: tuple[int, int]):
    try:
        x_pos, y_pos = pos

        # Try to find valid moves within bounds
        for _ in range(10):  # Limit attempts to prevent infinite loop
            x_rand = randint(-1, 1)
            y_rand = randint(-1, 1)

            x_move = x_pos + x_rand
            y_move = y_pos + y_rand

            # Check if new position is within bounds
            if 0 <= x_move <= 34 and 0 <= y_move <= 20:
                return (x_move, y_move)

        # If no valid move found after attempts, stay in place
        return (x_pos, y_pos)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))