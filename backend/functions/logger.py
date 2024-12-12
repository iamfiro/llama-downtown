import logging
import os
from datetime import datetime


class AgentLogger:
    def __init__(self):
        # Create logs directory if it doesn't exist
        os.makedirs('logs', exist_ok=True)

        # Set up file handler with current timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        log_file = f'logs/agent_activity_{timestamp}.log'

        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()  # Also print to console
            ]
        )

        self.logger = logging.getLogger(__name__)

    def log_movement(self, agent_id: int, old_pos: tuple, new_pos: tuple):
        """Log agent movement"""
        self.logger.info(f"Agent {agent_id} moved from {old_pos} to {new_pos}")

    def log_chat_initiated(self, from_id: int, to_id: int, distance: float):
        """Log when a chat is initiated between agents"""
        self.logger.info(f"Chat initiated: Agent {from_id} -> Agent {to_id} (distance: {distance:.2f})")

    def log_chat_saved(self, from_id: int, to_id: int, filename: str):
        """Log when a chat is saved to file"""
        self.logger.info(f"Chat saved: Agents {from_id}-{to_id} to {filename}")

    def log_error(self, error_msg: str):
        """Log errors"""
        self.logger.error(f"Error occurred: {error_msg}")

    def log_system_status(self, num_agents: int, active_chats: int):
        """Log system status"""
        self.logger.info(f"System status - Active agents: {num_agents}, Active chats: {active_chats}")