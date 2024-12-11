import logging
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from utils.log import Logger

logger = Logger.create(__name__, level=logging.DEBUG)
load_dotenv()


# @asynccontextmanager
# async def lifespan(_server: FastAPI):
#     motor_client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
#     await init_beanie(
#         database=motor_client[os.getenv("MONGODB_DATABASE")],
#         document_models=[
#             "entity.user.User",
#         ],
#     )
#     logger.info("Connected to MongoDB")
#     yield
#     motor_client.close()
#     logger.info("Disconnected from MongoDB")
#

app = FastAPI(
    title="Spark",
    description="Spark API",
    version="1.0.0",
    # lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(create_story.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
