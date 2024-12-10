from pydantic import BaseModel

class ChatUser(BaseModel):
    player1: int
    player2: int


