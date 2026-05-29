from motor.motor_asyncio import AsyncIOMotorClient
from mongomock_motor import AsyncMongoMockClient
from core.config import settings

client = AsyncMongoMockClient()
db = client.talentstage_db

# Expose collections
users_collection = db.get_collection("users")
profiles_collection = db.get_collection("profiles")
projects_collection = db.get_collection("projects")
proposals_collection = db.get_collection("proposals")
contracts_collection = db.get_collection("contracts")
reviews_collection = db.get_collection("reviews")

async def init_db_indexes():
    """Create unique indexes to prevent duplicate emails and enforce integrity"""
    await users_collection.create_index("email", unique=True)
    await profiles_collection.create_index("user_id", unique=True)
