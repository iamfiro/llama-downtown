from pydantic import BaseModel
from enum import Enum
from typing import List, Dict, Optional
from datetime import datetime

class AgentState(str, Enum):
    IDLE = "idle"
    MOVING = "moving"
    TALKING = "talking"
    WORKING = "working"
    SLEEPING = "sleeping"


class AgentMemory(BaseModel):
    content: str
    timestamp: datetime
    importance: float
    type: str
    location: Optional[Dict[str, float]] = None


class AgentContext(BaseModel):
    personality: str
    current_state: AgentState
    location: Dict[str, float]
    schedule: Dict[str, List[str]]
    relationships: Dict[str, float]
    needs: Dict[str, float]


class Agent(BaseModel):
    id: str
    name: str
    memories: List[AgentMemory]
    context: AgentContext


class AgentManager:
    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self.conversations: Dict[str, List[Dict]] = {}