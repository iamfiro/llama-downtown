from functions import chat, move


class Player:
    def __init__(self, name, pos):
        self.name = name
        self.pos = pos
        self.state = "idle"

    async def move(self):
        self.state = "move"
        self.pos = await move.move(self.pos)

    async def chat(self, prompt):
        self.state = "chat"
        return await chat.generate_response(prompt, self.name)


class PlayerManager:
    def __init__(self):
        self.players = {}

    def add_player(self, name: str, pos: tuple) -> Player:
        """새로운 플레이어를 추가"""
        if name in self.players:
            raise ValueError(f"Player {name} already exists")

        player = Player(name, pos)
        self.players[name] = player
        return player

    def remove_player(self, name: str) -> None:
        if name not in self.players:
            raise ValueError(f"Player {name} does not exist")

        del self.players[name]

    def get_player(self, name: str) -> Player:
        """특정 플레이어 조회"""
        if name not in self.players:
            raise ValueError(f"Player {name} does not exist")

        return self.players[name]

    def get_all_players(self) -> dict:
        """모든 플레이어 조회"""
        return self.players

    async def broadcast_chat(self, prompt: dict) -> list:
        """모든 플레이어에게 채팅 메시지 전송"""
        responses = []
        for player in self.players.values():
            response = await player.chat(prompt)
            responses.append(response)
        return responses

    def get_player_positions(self) -> dict:
        """모든 플레이어의 위치 조회"""
        return {name: player.pos for name, player in self.players.items()}