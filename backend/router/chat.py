from fastapi import APIRouter, HTTPException
import openai
from datetime import datetime
from typing import Dict, Optional, List
import asyncio

from entity import user

router = APIRouter(
    prefix="/behavior",
    tags=["behavior"],
)


class AgentManager:
    def __init__(self):
        self.agents: Dict[str, user.Agent] = {}
        self.conversations: Dict[str, List[Dict]] = {}
        self.locations = {
            "restaurant": {"x": 10, "y": 10},
            "office": {"x": 20, "y": 20},
            "home": {"x": 0, "y": 0},
        }

    def initialize_agents(self):
        """Initialize agents with default settings"""
        # William 초기화
        self.agents["william"] = user.Agent(
            id="william",
            name="William",
            memories=[],
            context=user.AgentContext(
                personality="Friendly and helpful. Enjoys talking with others.",
                current_state=user.AgentState.IDLE,
                location={"x": 5, "y": 5},
                schedule={
                    "morning": ["check_mail", "work"],
                    "afternoon": ["lunch", "socialize"],
                    "evening": ["dinner", "rest"]
                },
                relationships={},
                needs={
                    "energy": 1.0,
                    "social": 0.8,
                    "hunger": 0.3
                }
            )
        )

        # Emma 초기화
        self.agents["emma"] = user.Agent(
            id="emma",
            name="Emma",
            memories=[],
            context=user.AgentContext(
                personality="Creative and outgoing. Loves art and meeting new people.",
                current_state=user.AgentState.IDLE,
                location={"x": 15, "y": 15},
                schedule={
                    "morning": ["exercise", "work"],
                    "afternoon": ["lunch", "creative_work"],
                    "evening": ["dinner", "socialize"]
                },
                relationships={},
                needs={
                    "energy": 0.9,
                    "social": 0.7,
                    "hunger": 0.4
                }
            )
        )

    async def set_agent_state(self, agent_id: str, state: user.AgentState):
        """Update agent's state"""
        if agent_id not in self.agents:
            raise HTTPException(status_code=404, detail="Agent not found")
        self.agents[agent_id].context.current_state = state

    def get_task_location(self, task: str) -> Dict[str, float]:
        """Get location for a specific task"""
        task_locations = {
            "work": self.locations["office"],
            "lunch": self.locations["restaurant"],
            "dinner": self.locations["restaurant"],
            "rest": self.locations["home"],
        }
        return task_locations.get(task, {"x": 0, "y": 0})

    async def update_agent_state(self, agent_id: str, game_time: datetime) -> Dict:
        """Update agent state based on time and needs"""
        if agent_id not in self.agents:
            raise HTTPException(status_code=404, detail="Agent not found")

        agent = self.agents[agent_id]
        hour = game_time.hour

        # Night time behavior
        if 22 <= hour or hour < 6:
            await self.set_agent_state(agent_id, user.AgentState.SLEEPING)
            return {
                "action": "sleep",
                "location": self.locations["home"],
                "state": user.AgentState.SLEEPING
            }

        # Check needs
        if agent.context.needs["hunger"] < 0.3:
            await self.set_agent_state(agent_id, user.AgentState.MOVING)
            return {
                "action": "move",
                "location": self.locations["restaurant"],
                "state": user.AgentState.MOVING,
                "reason": "Looking for food because hungry"
            }

        if agent.context.needs["social"] < 0.5:
            nearest_agent = self.find_nearest_agent(agent_id)
            if nearest_agent:
                await self.set_agent_state(agent_id, user.AgentState.SOCIALIZING)
                return {
                    "action": "move",
                    "location": self.agents[nearest_agent].context.location,
                    "target_agent": nearest_agent,
                    "state": user.AgentState.SOCIALIZING,
                    "reason": "Wanting to socialize"
                }

        # Regular schedule
        current_period = self.get_time_period(hour)
        if current_period in agent.context.schedule:
            task = agent.context.schedule[current_period][0]
            location = self.get_task_location(task)
            await self.set_agent_state(agent_id, user.AgentState.WORKING)
            return {
                "action": "move",
                "location": location,
                "state": user.AgentState.WORKING,
                "reason": f"Following schedule: {task}"
            }

        await self.set_agent_state(agent_id, user.AgentState.IDLE)
        return {"action": "idle", "state": user.AgentState.IDLE}

    async def process_agent_interaction(self, agent_id: str, target_agent_id: str) -> Dict:
        """Process interaction between two agents"""
        if agent_id not in self.agents or target_agent_id not in self.agents:
            raise HTTPException(status_code=404, detail="Agent not found")

        agent = self.agents[agent_id]
        target_agent = self.agents[target_agent_id]

        conversation_context = {
            "speaker_name": agent.name,
            "speaker_personality": agent.context.personality,
            "listener_name": target_agent.name,
            "listener_personality": target_agent.context.personality,
            "location": agent.context.location,
            "relationship_level": agent.context.relationships.get(target_agent_id, 0)
        }

        try:
            response = await self.generate_conversation(conversation_context)

            # Store conversation
            conversation_id = f"{min(agent_id, target_agent_id)}_{max(agent_id, target_agent_id)}"
            if conversation_id not in self.conversations:
                self.conversations[conversation_id] = []

            self.conversations[conversation_id].append({
                "timestamp": datetime.now().isoformat(),
                "content": response["content"],
                "speaker": agent_id,
                "listener": target_agent_id,
                "sentiment": response["sentiment"]
            })

            # Update relationships
            self.update_relationship(agent_id, target_agent_id, response["sentiment"])

            return {
                "conversation_id": conversation_id,
                "content": response["content"],
                "sentiment": response["sentiment"]
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Conversation generation failed: {str(e)}")

    async def generate_conversation(self, context: Dict) -> Dict:
        """Generate conversation using OpenAI's API"""
        prompt = f"""Context:
Speaker: {context['speaker_name']} ({context['speaker_personality']})
Listener: {context['listener_name']} ({context['listener_personality']})
Location: {context['location']}
Relationship: {context['relationship_level']}

Generate a natural conversation between {context['speaker_name']} and {context['listener_name']}.
"""

        try:
            response = await openai.chat.completions.create(
                model="gpt-4o-mini-2024-07-18",
                messages=[
                    {"role": "system", "content": "You are a conversation generator for AI agents."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Parse the response and ensure proper format
            content = response.choices[0].message.content
            return {
                "content": content,
                "sentiment": self._analyze_sentiment(content)
            }
        except Exception as e:
            return {
                "content": f"Hello {context['listener_name']}!",
                "sentiment": 0.1
            }

    def _analyze_sentiment(self, content: str) -> float:
        """Simple sentiment analysis (placeholder - should be implemented properly)"""
        # This should be replaced with proper sentiment analysis
        return 0.1

    def update_relationship(self, agent1_id: str, agent2_id: str, sentiment: float):
        """Update relationship scores between agents"""
        for id1, id2 in [(agent1_id, agent2_id), (agent2_id, agent1_id)]:
            current_score = self.agents[id1].context.relationships.get(id2, 0)
            new_score = current_score + (sentiment * 0.1)
            self.agents[id1].context.relationships[id2] = max(-1, min(1, new_score))

    def find_nearest_agent(self, agent_id: str) -> Optional[str]:
        """Find the nearest agent to the given agent"""
        agent = self.agents[agent_id]
        min_distance = float('inf')
        nearest_agent_id = None

        for other_id, other_agent in self.agents.items():
            if other_id != agent_id:
                distance = self.calculate_distance(
                    agent.context.location,
                    other_agent.context.location
                )
                if distance < min_distance:
                    min_distance = distance
                    nearest_agent_id = other_id

        return nearest_agent_id

    @staticmethod
    def calculate_distance(pos1: Dict[str, float], pos2: Dict[str, float]) -> float:
        """Calculate distance between two positions"""
        return ((pos1["x"] - pos2["x"]) ** 2 + (pos1["y"] - pos2["y"]) ** 2) ** 0.5

    @staticmethod
    def get_time_period(hour: int) -> str:
        """Get time period based on hour"""
        if 6 <= hour < 12:
            return "morning"
        elif 12 <= hour < 18:
            return "afternoon"
        elif 18 <= hour < 22:
            return "evening"
        else:
            return "night"


# Initialize AgentManager
agent_manager = AgentManager()

agent_manager.initialize_agents()
print(agent_manager.agents)

# FastAPI routes
@router.post("/agents/{agent_id}/update")
async def update_agent(agent_id: str, game_time: datetime):
    """Update agent state and determine next action"""
    try:
        return await agent_manager.update_agent_state(agent_id, game_time)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agents/{agent_id}/state")
async def get_agent_state(agent_id: str):
    """Get current state of an agent"""
    try:
        agent = agent_manager.agents[agent_id]
        return {
            "state": agent.context.current_state,
            "location": agent.context.location,
            "needs": agent.context.needs
        }
    except KeyError:
        raise HTTPException(status_code=404, detail="Agent not found")


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history"""
    try:
        return agent_manager.conversations[conversation_id]
    except KeyError:
        raise HTTPException(status_code=404, detail="Conversation not found")