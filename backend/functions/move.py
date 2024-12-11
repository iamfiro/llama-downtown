from random import randint
from fastapi import HTTPException

async def move(pos: dict[int,int]):
    try:
        x_pos, y_pos = pos
        while True:
            x_rand = randint(-1, 1)
            x_move = x_pos + x_rand
            if x_move < 0 or x_move > 34:
                continue
        while True:
            y_rand = randint(-1, 1)
            y_move = y_pos + y_rand
            if y_move < 0 or y_move > 20:
                continue

        return [x_move, y_move]
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))