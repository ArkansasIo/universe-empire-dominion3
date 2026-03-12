"""
Stellar Dominion Backend - Complete Game Server
A comprehensive 4X space strategy game backend using FastAPI and MongoDB
"""
import os
import json
import time
import hashlib
import secrets
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "stellar_dominion")

# Initialize MongoDB
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
player_states_collection = db["player_states"]
sessions_collection = db["sessions"]
messages_collection = db["messages"]
alliances_collection = db["alliances"]
market_orders_collection = db["market_orders"]


# ==================== GAME CONFIGURATION ====================

INITIAL_RESOURCES = {
    "metal": 50000,
    "crystal": 30000,
    "deuterium": 20000,
    "energy": 500
}

RESOURCE_PRODUCTION = {
    "metalMine": {"metal": 30, "energy": -10},
    "crystalMine": {"crystal": 20, "energy": -10},
    "deuteriumSynthesizer": {"deuterium": 10, "energy": -20},
    "solarPlant": {"energy": 20},
    "fusionReactor": {"energy": 50, "deuterium": -10}
}

BUILDING_COSTS = {
    "metalMine": {"metal": 60, "crystal": 15, "factor": 1.5},
    "crystalMine": {"metal": 48, "crystal": 24, "factor": 1.6},
    "deuteriumSynthesizer": {"metal": 225, "crystal": 75, "factor": 1.5},
    "solarPlant": {"metal": 75, "crystal": 30, "factor": 1.5},
    "fusionReactor": {"metal": 900, "crystal": 360, "deuterium": 180, "factor": 1.8},
    "roboticsFactory": {"metal": 400, "crystal": 120, "deuterium": 200, "factor": 2.0},
    "shipyard": {"metal": 400, "crystal": 200, "deuterium": 100, "factor": 2.0},
    "researchLab": {"metal": 200, "crystal": 400, "deuterium": 200, "factor": 2.0},
    "allianceDepot": {"metal": 20000, "crystal": 40000, "factor": 2.0},
    "missileSilo": {"metal": 20000, "crystal": 20000, "deuterium": 1000, "factor": 2.0},
    "naniteFactory": {"metal": 1000000, "crystal": 500000, "deuterium": 100000, "factor": 2.0},
    "terraformer": {"metal": 0, "crystal": 50000, "deuterium": 100000, "energy": 1000, "factor": 2.0},
    "spaceDock": {"metal": 200, "crystal": 0, "deuterium": 50, "energy": 50, "factor": 5.0}
}

RESEARCH_COSTS = {
    "energyTechnology": {"metal": 0, "crystal": 800, "deuterium": 400, "factor": 2.0},
    "laserTechnology": {"metal": 200, "crystal": 100, "factor": 2.0},
    "ionTechnology": {"metal": 1000, "crystal": 300, "deuterium": 100, "factor": 2.0},
    "hyperspaceTechnology": {"metal": 0, "crystal": 4000, "deuterium": 2000, "factor": 2.0},
    "plasmaTechnology": {"metal": 2000, "crystal": 4000, "deuterium": 1000, "factor": 2.0},
    "combustionDrive": {"metal": 400, "crystal": 0, "deuterium": 600, "factor": 2.0},
    "impulseDrive": {"metal": 2000, "crystal": 4000, "deuterium": 600, "factor": 2.0},
    "hyperspaceDrive": {"metal": 10000, "crystal": 20000, "deuterium": 6000, "factor": 2.0},
    "espionageTechnology": {"metal": 200, "crystal": 1000, "deuterium": 200, "factor": 2.0},
    "computerTechnology": {"metal": 0, "crystal": 400, "deuterium": 600, "factor": 2.0},
    "astrophysics": {"metal": 4000, "crystal": 8000, "deuterium": 4000, "factor": 1.75},
    "intergalacticResearchNetwork": {"metal": 240000, "crystal": 400000, "deuterium": 160000, "factor": 2.0},
    "gravitonTechnology": {"metal": 0, "crystal": 0, "deuterium": 0, "energy": 300000, "factor": 3.0},
    "weaponsTechnology": {"metal": 800, "crystal": 200, "factor": 2.0},
    "shieldingTechnology": {"metal": 200, "crystal": 600, "factor": 2.0},
    "armorTechnology": {"metal": 1000, "crystal": 0, "factor": 2.0}
}

SHIP_COSTS = {
    "lightFighter": {"metal": 3000, "crystal": 1000, "buildTime": 30},
    "heavyFighter": {"metal": 6000, "crystal": 4000, "buildTime": 60},
    "cruiser": {"metal": 20000, "crystal": 7000, "deuterium": 2000, "buildTime": 120},
    "battleship": {"metal": 45000, "crystal": 15000, "buildTime": 240},
    "battlecruiser": {"metal": 30000, "crystal": 40000, "deuterium": 15000, "buildTime": 300},
    "bomber": {"metal": 50000, "crystal": 25000, "deuterium": 15000, "buildTime": 240},
    "destroyer": {"metal": 60000, "crystal": 50000, "deuterium": 15000, "buildTime": 360},
    "deathstar": {"metal": 5000000, "crystal": 4000000, "deuterium": 1000000, "buildTime": 7200},
    "smallCargo": {"metal": 2000, "crystal": 2000, "buildTime": 20},
    "largeCargo": {"metal": 6000, "crystal": 6000, "buildTime": 40},
    "colonyShip": {"metal": 10000, "crystal": 20000, "deuterium": 10000, "buildTime": 600},
    "recycler": {"metal": 10000, "crystal": 6000, "deuterium": 2000, "buildTime": 120},
    "espionageProbe": {"metal": 0, "crystal": 1000, "buildTime": 10},
    "solarSatellite": {"metal": 0, "crystal": 2000, "deuterium": 500, "buildTime": 30}
}

DEFENSE_COSTS = {
    "rocketLauncher": {"metal": 2000, "buildTime": 10},
    "lightLaser": {"metal": 1500, "crystal": 500, "buildTime": 15},
    "heavyLaser": {"metal": 6000, "crystal": 2000, "buildTime": 30},
    "gaussCannon": {"metal": 20000, "crystal": 15000, "deuterium": 2000, "buildTime": 60},
    "ionCannon": {"metal": 5000, "crystal": 3000, "buildTime": 45},
    "plasmaTurret": {"metal": 50000, "crystal": 50000, "deuterium": 30000, "buildTime": 120},
    "smallShieldDome": {"metal": 10000, "crystal": 10000, "buildTime": 120},
    "largeShieldDome": {"metal": 50000, "crystal": 50000, "buildTime": 300},
    "antiBallisticMissiles": {"metal": 8000, "crystal": 0, "deuterium": 2000, "buildTime": 30},
    "interplanetaryMissiles": {"metal": 12500, "crystal": 2500, "deuterium": 10000, "buildTime": 60}
}

COMMANDER_TEMPLATES = {
    "militarist": {"attackBonus": 0.15, "defenseBonus": 0.05, "fleetSpeed": 0.1},
    "economist": {"resourceBonus": 0.2, "tradingBonus": 0.15, "buildSpeed": 0.1},
    "scientist": {"researchBonus": 0.25, "techUnlock": 0.1, "energyBonus": 0.05},
    "explorer": {"expeditionBonus": 0.2, "discoveryBonus": 0.15, "fleetCapacity": 0.1},
    "diplomat": {"allianceBonus": 0.15, "tradeBonus": 0.1, "peaceBonus": 0.2}
}

GOVERNMENT_TYPES = {
    "democracy": {"resourceBonus": 0.1, "researchBonus": 0.05, "happiness": 0.15},
    "autocracy": {"attackBonus": 0.15, "buildSpeed": 0.1, "control": 0.2},
    "oligarchy": {"tradingBonus": 0.2, "resourceBonus": 0.05, "influence": 0.15},
    "technocracy": {"researchBonus": 0.2, "energyBonus": 0.1, "innovation": 0.15},
    "theocracy": {"defenseBonus": 0.15, "happiness": 0.1, "unity": 0.2}
}

PLANET_TYPES = [
    {"type": "Terran", "class": "M", "habitability": 0.9, "resourceMod": 1.0},
    {"type": "Ocean", "class": "O", "habitability": 0.7, "resourceMod": 0.8},
    {"type": "Desert", "class": "D", "habitability": 0.5, "resourceMod": 1.2},
    {"type": "Ice", "class": "P", "habitability": 0.4, "resourceMod": 0.9},
    {"type": "Volcanic", "class": "Y", "habitability": 0.3, "resourceMod": 1.5},
    {"type": "Gas Giant", "class": "J", "habitability": 0.0, "resourceMod": 2.0},
    {"type": "Barren", "class": "L", "habitability": 0.2, "resourceMod": 1.1}
]


# ==================== PYDANTIC MODELS ====================

class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class AccountSetup(BaseModel):
    planetName: str = "New Colony"
    commanderType: str = "militarist"
    governmentType: str = "democracy"
    faction: str = "terran"

class BuildingUpgrade(BaseModel):
    buildingType: str
    planetId: Optional[str] = None

class ResearchStart(BaseModel):
    techId: str

class ShipBuild(BaseModel):
    shipType: str
    quantity: int = 1

class DefenseBuild(BaseModel):
    defenseType: str
    quantity: int = 1

class FleetMission(BaseModel):
    targetCoordinates: str
    missionType: str  # attack, transport, colonize, espionage, expedition
    ships: Dict[str, int]
    resources: Optional[Dict[str, int]] = None

class MarketOrder(BaseModel):
    resourceType: str
    quantity: int
    pricePerUnit: float
    orderType: str  # buy or sell

class MessageSend(BaseModel):
    recipientId: str
    subject: str
    content: str

class AllianceCreate(BaseModel):
    name: str
    tag: str
    description: str = ""


# ==================== HELPER FUNCTIONS ====================

def get_timestamp():
    return datetime.now(timezone.utc)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_session_token() -> str:
    return secrets.token_hex(32)

def calculate_cost(base_costs: dict, level: int) -> dict:
    factor = base_costs.get("factor", 1.5)
    costs = {}
    for resource, amount in base_costs.items():
        if resource != "factor" and resource != "buildTime":
            costs[resource] = int(amount * (factor ** level))
    return costs

def calculate_production(buildings: dict) -> dict:
    production = {"metal": 20, "crystal": 10, "deuterium": 0, "energy": 0}
    
    for building, level in buildings.items():
        if building in RESOURCE_PRODUCTION and level > 0:
            for resource, base_prod in RESOURCE_PRODUCTION[building].items():
                production[resource] = production.get(resource, 0) + int(base_prod * level * 1.1 ** level)
    
    return production

def calculate_empire_score(player_state: dict) -> int:
    score = 0
    
    # Buildings score
    buildings = player_state.get("buildings", {})
    for building, level in buildings.items():
        score += level * 100
    
    # Research score
    research = player_state.get("research", {})
    for tech, level in research.items():
        score += level * 200
    
    # Fleet score
    units = player_state.get("units", {})
    for unit, count in units.items():
        ship_data = SHIP_COSTS.get(unit, {})
        unit_value = (ship_data.get("metal", 0) + ship_data.get("crystal", 0) + ship_data.get("deuterium", 0)) // 1000
        score += count * unit_value
    
    # Defense score
    defense = player_state.get("defense", {})
    for def_type, count in defense.items():
        def_data = DEFENSE_COSTS.get(def_type, {})
        def_value = (def_data.get("metal", 0) + def_data.get("crystal", 0) + def_data.get("deuterium", 0)) // 1000
        score += count * def_value
    
    return score

def calculate_fleet_power(units: dict) -> int:
    power = 0
    ship_power = {
        "lightFighter": 50, "heavyFighter": 150, "cruiser": 400,
        "battleship": 1000, "battlecruiser": 700, "bomber": 500,
        "destroyer": 2000, "deathstar": 200000,
        "smallCargo": 5, "largeCargo": 10, "colonyShip": 30,
        "recycler": 20, "espionageProbe": 1, "solarSatellite": 1
    }
    for ship, count in units.items():
        power += ship_power.get(ship, 10) * count
    return power

def generate_coordinates() -> str:
    import random
    galaxy = random.randint(1, 9)
    system = random.randint(1, 499)
    position = random.randint(1, 15)
    return f"[{galaxy}:{system}:{position}]"

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                result["id"] = str(value)
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            elif isinstance(value, list):
                result[key] = [serialize_doc(item) if isinstance(item, dict) else item for item in value]
            else:
                result[key] = value
        return result
    return doc


# ==================== SESSION MANAGEMENT ====================

sessions_store: Dict[str, dict] = {}

def get_session(request: Request) -> Optional[dict]:
    token = request.cookies.get("session_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
    
    if token and token in sessions_store:
        return sessions_store[token]
    return None

def require_auth(request: Request) -> dict:
    session = get_session(request)
    if not session:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return session


# ==================== FASTAPI APP ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Stellar Dominion Server Starting...")
    
    # Create indexes
    users_collection.create_index("username", unique=True)
    player_states_collection.create_index("userId")
    sessions_collection.create_index("token", unique=True)
    
    print("✅ Database indexes created")
    print(f"📊 Connected to MongoDB: {DB_NAME}")
    yield
    # Shutdown
    print("👋 Stellar Dominion Server Shutting Down...")

app = FastAPI(
    title="Stellar Dominion API",
    description="A comprehensive 4X space strategy game backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/register")
async def register(data: UserRegister, response: Response):
    # Check if user exists
    existing = users_collection.find_one({"username": data.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create user
    user_doc = {
        "username": data.username,
        "passwordHash": hash_password(data.password),
        "createdAt": get_timestamp(),
        "updatedAt": get_timestamp()
    }
    result = users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create session
    token = generate_session_token()
    sessions_store[token] = {"userId": user_id, "username": data.username}
    
    response.set_cookie(key="session_token", value=token, httponly=True, samesite="lax")
    
    return {"userId": user_id, "username": data.username, "token": token}


@app.post("/api/auth/login")
async def login(data: UserLogin, response: Response):
    user = users_collection.find_one({"username": data.username})
    if not user or user["passwordHash"] != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    
    # Create session
    token = generate_session_token()
    sessions_store[token] = {"userId": user_id, "username": data.username}
    
    response.set_cookie(key="session_token", value=token, httponly=True, samesite="lax")
    
    return {"userId": user_id, "username": data.username, "token": token}


@app.post("/api/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token and token in sessions_store:
        del sessions_store[token]
    response.delete_cookie("session_token")
    return {"success": True}


@app.get("/api/auth/me")
async def get_current_user(request: Request):
    session = get_session(request)
    if not session:
        return {"authenticated": False}
    
    player_state = player_states_collection.find_one({"userId": session["userId"]})
    
    return {
        "authenticated": True,
        "userId": session["userId"],
        "username": session["username"],
        "needsSetup": player_state is None or not player_state.get("setupComplete", False)
    }


@app.get("/api/auth/user")
async def get_auth_user(request: Request):
    """Endpoint for frontend auth check"""
    session = get_session(request)
    if not session:
        # Return null/empty for unauthenticated - frontend handles this
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    player_state = player_states_collection.find_one({"userId": session["userId"]})
    needs_setup = player_state is None or not player_state.get("setupComplete", False)
    
    return {
        "id": session["userId"],
        "username": session["username"],
        "needsSetup": needs_setup,
        "isAdmin": False,
        "role": "player"
    }


# ==================== PLAYER STATE ENDPOINTS ====================

@app.post("/api/player/setup")
async def setup_player(data: AccountSetup, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    # Check if already setup
    existing = player_states_collection.find_one({"userId": user_id})
    if existing and existing.get("setupComplete"):
        raise HTTPException(status_code=400, detail="Account already setup")
    
    # Generate random coordinates
    coordinates = generate_coordinates()
    
    # Get planet type
    import random
    planet_type = random.choice(PLANET_TYPES)
    
    # Create commander based on type
    commander_bonuses = COMMANDER_TEMPLATES.get(data.commanderType, COMMANDER_TEMPLATES["militarist"])
    commander = {
        "name": "Commander",
        "type": data.commanderType,
        "level": 1,
        "experience": 0,
        "bonuses": commander_bonuses,
        "skills": [],
        "equipment": []
    }
    
    # Create government
    gov_bonuses = GOVERNMENT_TYPES.get(data.governmentType, GOVERNMENT_TYPES["democracy"])
    government = {
        "type": data.governmentType,
        "stability": 100,
        "approval": 75,
        "bonuses": gov_bonuses,
        "policies": [],
        "leaders": []
    }
    
    # Create initial player state
    player_state = {
        "userId": user_id,
        "setupComplete": True,
        "planetName": data.planetName,
        "planetType": planet_type,
        "coordinates": coordinates,
        "faction": data.faction,
        "resources": INITIAL_RESOURCES.copy(),
        "buildings": {
            "metalMine": 1,
            "crystalMine": 1,
            "deuteriumSynthesizer": 0,
            "solarPlant": 1,
            "roboticsFactory": 0,
            "shipyard": 0,
            "researchLab": 0
        },
        "research": {},
        "units": {},
        "defense": {},
        "commander": commander,
        "government": government,
        "empireLevel": 1,
        "empireExperience": 0,
        "tier": 1,
        "tierExperience": 0,
        "totalTurns": 0,
        "currentTurns": 100,
        "knownPlanets": [{"name": data.planetName, "coordinates": coordinates, "type": planet_type}],
        "missions": [],
        "buildQueue": [],
        "researchQueue": [],
        "lastResourceUpdate": get_timestamp(),
        "createdAt": get_timestamp(),
        "updatedAt": get_timestamp()
    }
    
    if existing:
        player_states_collection.update_one({"userId": user_id}, {"$set": player_state})
    else:
        player_states_collection.insert_one(player_state)
    
    return serialize_doc(player_state)


@app.get("/api/player/state")
async def get_player_state(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        return {"needsSetup": True}
    
    # Calculate current production
    production = calculate_production(player_state.get("buildings", {}))
    
    # Calculate scores
    empire_score = calculate_empire_score(player_state)
    fleet_power = calculate_fleet_power(player_state.get("units", {}))
    
    # Update resources based on time passed
    last_update = player_state.get("lastResourceUpdate", get_timestamp())
    if isinstance(last_update, str):
        last_update = datetime.fromisoformat(last_update.replace("Z", "+00:00"))
    elif isinstance(last_update, datetime) and last_update.tzinfo is None:
        last_update = last_update.replace(tzinfo=timezone.utc)
    
    now = get_timestamp()
    hours_passed = (now - last_update).total_seconds() / 3600
    
    if hours_passed > 0:
        resources = player_state.get("resources", INITIAL_RESOURCES.copy())
        for resource, rate in production.items():
            if rate > 0:
                resources[resource] = resources.get(resource, 0) + int(rate * hours_passed)
        
        player_states_collection.update_one(
            {"userId": user_id},
            {"$set": {"resources": resources, "lastResourceUpdate": now}}
        )
        player_state["resources"] = resources
    
    result = serialize_doc(player_state)
    result["production"] = production
    result["empireScore"] = empire_score
    result["fleetPower"] = fleet_power
    
    return result


@app.get("/api/game/state")
async def get_game_state(request: Request):
    """Endpoint for frontend game state - alias for player/state"""
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        return {"setupComplete": False}
    
    # Calculate current production
    production = calculate_production(player_state.get("buildings", {}))
    
    # Calculate scores
    empire_score = calculate_empire_score(player_state)
    fleet_power = calculate_fleet_power(player_state.get("units", {}))
    
    # Update resources based on time passed
    now = get_timestamp()
    last_update = player_state.get("lastResourceUpdate")
    
    hours_passed = 0
    if last_update:
        try:
            if isinstance(last_update, str):
                last_update = datetime.fromisoformat(last_update.replace("Z", "+00:00"))
            elif isinstance(last_update, datetime):
                if last_update.tzinfo is None:
                    last_update = last_update.replace(tzinfo=timezone.utc)
            hours_passed = (now - last_update).total_seconds() / 3600
        except:
            hours_passed = 0
    
    if hours_passed > 0.01:  # Update if more than 36 seconds passed
        resources = player_state.get("resources", INITIAL_RESOURCES.copy())
        for resource, rate in production.items():
            if rate > 0:
                resources[resource] = resources.get(resource, 0) + int(rate * hours_passed)
        
        player_states_collection.update_one(
            {"userId": user_id},
            {"$set": {"resources": resources, "lastResourceUpdate": now}}
        )
        player_state["resources"] = resources
    
    result = serialize_doc(player_state)
    result["production"] = production
    result["empireScore"] = empire_score
    result["fleetPower"] = fleet_power
    
    return result


@app.put("/api/player/state")
async def update_player_state(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    data = await request.json()
    
    # Remove protected fields
    protected_fields = ["_id", "userId", "createdAt"]
    for field in protected_fields:
        data.pop(field, None)
    
    data["updatedAt"] = get_timestamp()
    
    result = player_states_collection.update_one(
        {"userId": user_id},
        {"$set": data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    return {"success": True}


@app.put("/api/game/state")
async def save_game_state(request: Request):
    """Endpoint for frontend to save game state"""
    session = require_auth(request)
    user_id = session["userId"]
    
    data = await request.json()
    
    # Remove protected fields
    protected_fields = ["_id", "userId", "createdAt", "id"]
    for field in protected_fields:
        data.pop(field, None)
    
    data["updatedAt"] = get_timestamp()
    
    result = player_states_collection.update_one(
        {"userId": user_id},
        {"$set": data},
        upsert=True
    )
    
    return {"success": True}


# ==================== BUILDINGS ENDPOINTS ====================

@app.post("/api/buildings/upgrade")
async def upgrade_building(data: BuildingUpgrade, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    buildings = player_state.get("buildings", {})
    current_level = buildings.get(data.buildingType, 0)
    
    # Get building cost
    base_cost = BUILDING_COSTS.get(data.buildingType)
    if not base_cost:
        raise HTTPException(status_code=400, detail="Invalid building type")
    
    cost = calculate_cost(base_cost, current_level)
    
    # Check resources
    resources = player_state.get("resources", {})
    for resource, amount in cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    # Deduct resources and upgrade
    for resource, amount in cost.items():
        resources[resource] -= amount
    
    buildings[data.buildingType] = current_level + 1
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"buildings": buildings, "resources": resources, "updatedAt": get_timestamp()}}
    )
    
    return {
        "success": True,
        "buildingType": data.buildingType,
        "newLevel": current_level + 1,
        "cost": cost
    }


@app.get("/api/buildings/costs")
async def get_building_costs(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    buildings = player_state.get("buildings", {})
    costs = {}
    
    for building_type, base_cost in BUILDING_COSTS.items():
        current_level = buildings.get(building_type, 0)
        costs[building_type] = {
            "currentLevel": current_level,
            "upgradeCost": calculate_cost(base_cost, current_level)
        }
    
    return costs


# ==================== RESEARCH ENDPOINTS ====================

@app.post("/api/research/start")
async def start_research(data: ResearchStart, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    # Check if research lab exists
    buildings = player_state.get("buildings", {})
    if buildings.get("researchLab", 0) < 1:
        raise HTTPException(status_code=400, detail="Research lab required")
    
    research = player_state.get("research", {})
    current_level = research.get(data.techId, 0)
    
    # Get research cost
    base_cost = RESEARCH_COSTS.get(data.techId)
    if not base_cost:
        raise HTTPException(status_code=400, detail="Invalid research type")
    
    cost = calculate_cost(base_cost, current_level)
    
    # Check resources
    resources = player_state.get("resources", {})
    for resource, amount in cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    # Deduct resources and upgrade research
    for resource, amount in cost.items():
        resources[resource] -= amount
    
    research[data.techId] = current_level + 1
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"research": research, "resources": resources, "updatedAt": get_timestamp()}}
    )
    
    return {
        "success": True,
        "techId": data.techId,
        "newLevel": current_level + 1,
        "cost": cost
    }


@app.get("/api/research/available")
async def get_available_research(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    research = player_state.get("research", {})
    available = []
    
    for tech_id, base_cost in RESEARCH_COSTS.items():
        current_level = research.get(tech_id, 0)
        available.append({
            "techId": tech_id,
            "currentLevel": current_level,
            "upgradeCost": calculate_cost(base_cost, current_level)
        })
    
    return available


# ==================== SHIPYARD ENDPOINTS ====================

@app.post("/api/shipyard/build")
async def build_ships(data: ShipBuild, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    # Check shipyard
    buildings = player_state.get("buildings", {})
    if buildings.get("shipyard", 0) < 1:
        raise HTTPException(status_code=400, detail="Shipyard required")
    
    # Get ship cost
    ship_cost = SHIP_COSTS.get(data.shipType)
    if not ship_cost:
        raise HTTPException(status_code=400, detail="Invalid ship type")
    
    # Calculate total cost
    total_cost = {}
    for resource, amount in ship_cost.items():
        if resource != "buildTime":
            total_cost[resource] = amount * data.quantity
    
    # Check resources
    resources = player_state.get("resources", {})
    for resource, amount in total_cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    # Deduct resources and add ships
    for resource, amount in total_cost.items():
        resources[resource] -= amount
    
    units = player_state.get("units", {})
    units[data.shipType] = units.get(data.shipType, 0) + data.quantity
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"units": units, "resources": resources, "updatedAt": get_timestamp()}}
    )
    
    return {
        "success": True,
        "shipType": data.shipType,
        "quantity": data.quantity,
        "totalCost": total_cost,
        "newCount": units[data.shipType]
    }


@app.get("/api/shipyard/available")
async def get_available_ships(request: Request):
    session = require_auth(request)
    
    ships = []
    for ship_type, cost in SHIP_COSTS.items():
        ships.append({
            "shipType": ship_type,
            "cost": {k: v for k, v in cost.items() if k != "buildTime"},
            "buildTime": cost.get("buildTime", 60)
        })
    
    return ships


# ==================== DEFENSE ENDPOINTS ====================

@app.post("/api/defense/build")
async def build_defense(data: DefenseBuild, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    # Get defense cost
    def_cost = DEFENSE_COSTS.get(data.defenseType)
    if not def_cost:
        raise HTTPException(status_code=400, detail="Invalid defense type")
    
    # Calculate total cost
    total_cost = {}
    for resource, amount in def_cost.items():
        if resource != "buildTime":
            total_cost[resource] = amount * data.quantity
    
    # Check resources
    resources = player_state.get("resources", {})
    for resource, amount in total_cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    # Deduct resources and add defense
    for resource, amount in total_cost.items():
        resources[resource] -= amount
    
    defense = player_state.get("defense", {})
    defense[data.defenseType] = defense.get(data.defenseType, 0) + data.quantity
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"defense": defense, "resources": resources, "updatedAt": get_timestamp()}}
    )
    
    return {
        "success": True,
        "defenseType": data.defenseType,
        "quantity": data.quantity,
        "totalCost": total_cost,
        "newCount": defense[data.defenseType]
    }


# ==================== FLEET/MISSION ENDPOINTS ====================

@app.post("/api/fleet/mission")
async def start_fleet_mission(data: FleetMission, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    units = player_state.get("units", {})
    
    # Verify ships are available
    for ship_type, count in data.ships.items():
        if units.get(ship_type, 0) < count:
            raise HTTPException(status_code=400, detail=f"Not enough {ship_type}")
    
    # Remove ships from fleet
    for ship_type, count in data.ships.items():
        units[ship_type] -= count
    
    # Create mission
    mission = {
        "id": str(ObjectId()),
        "userId": user_id,
        "targetCoordinates": data.targetCoordinates,
        "missionType": data.missionType,
        "ships": data.ships,
        "resources": data.resources or {},
        "status": "in_progress",
        "startTime": get_timestamp(),
        "arrivalTime": get_timestamp()  # Would calculate based on distance
    }
    
    missions = player_state.get("missions", [])
    missions.append(mission)
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"units": units, "missions": missions, "updatedAt": get_timestamp()}}
    )
    
    return {"success": True, "mission": mission}


@app.post("/api/game/send-fleet")
async def send_fleet(request: Request):
    """Endpoint for frontend to send fleet on mission"""
    session = require_auth(request)
    user_id = session["userId"]
    
    data = await request.json()
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    units = player_state.get("units", {})
    ships = data.get("ships", {})
    
    # Verify ships are available
    for ship_type, count in ships.items():
        if units.get(ship_type, 0) < count:
            raise HTTPException(status_code=400, detail=f"Not enough {ship_type}")
    
    # Remove ships from fleet
    for ship_type, count in ships.items():
        units[ship_type] -= count
    
    # Create mission
    import random
    travel_time = random.randint(60, 600)  # 1-10 minutes
    
    mission = {
        "id": str(ObjectId()),
        "type": data.get("missionType", "attack"),
        "target": data.get("destination", "[1:1:1]"),
        "units": ships,
        "arrivalTime": (get_timestamp().timestamp() + travel_time) * 1000,
        "returnTime": (get_timestamp().timestamp() + travel_time * 2) * 1000,
        "status": "outbound"
    }
    
    missions = player_state.get("missions", [])
    missions.append(mission)
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"units": units, "missions": missions, "updatedAt": get_timestamp()}}
    )
    
    return {"success": True, "mission": mission}


@app.post("/api/game/process-missions")
async def process_game_missions(request: Request):
    """Process completed missions"""
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    missions = player_state.get("missions", [])
    units = player_state.get("units", {})
    resources = player_state.get("resources", {})
    
    now = get_timestamp().timestamp() * 1000
    completed = []
    ongoing = []
    
    for mission in missions:
        return_time = mission.get("returnTime", 0)
        if now >= return_time:
            # Mission complete - return ships
            for ship_type, count in mission.get("units", {}).items():
                units[ship_type] = units.get(ship_type, 0) + count
            
            # Add loot for attack missions
            if mission.get("type") == "attack":
                import random
                resources["metal"] = resources.get("metal", 0) + random.randint(100, 1000)
                resources["crystal"] = resources.get("crystal", 0) + random.randint(50, 500)
            
            mission["status"] = "completed"
            mission["processed"] = True
            completed.append(mission)
        else:
            ongoing.append(mission)
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"units": units, "resources": resources, "missions": ongoing, "updatedAt": get_timestamp()}}
    )
    
    return {"success": True, "completed": completed, "ongoing": len(ongoing)}


@app.get("/api/fleet/missions")
async def get_fleet_missions(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        return []
    
    return player_state.get("missions", [])


@app.get("/api/game/missions")
async def get_game_missions(request: Request):
    """Alias for fleet missions endpoint"""
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        return []
    
    return player_state.get("missions", [])


# ==================== GALAXY/UNIVERSE ENDPOINTS ====================

@app.get("/api/galaxy/{galaxy}/{system}")
async def get_solar_system(galaxy: int, system: int, request: Request):
    session = require_auth(request)
    
    # Generate procedural solar system
    import random
    random.seed(galaxy * 1000 + system)
    
    planets = []
    for position in range(1, 16):
        if random.random() > 0.3:  # 70% chance of planet
            planet_type = random.choice(PLANET_TYPES)
            planets.append({
                "position": position,
                "coordinates": f"[{galaxy}:{system}:{position}]",
                "type": planet_type["type"],
                "class": planet_type["class"],
                "name": f"Planet {galaxy}:{system}:{position}",
                "owner": None,
                "activity": None
            })
    
    return {
        "galaxy": galaxy,
        "system": system,
        "planets": planets
    }


@app.get("/api/universe/overview")
async def get_universe_overview(request: Request):
    session = require_auth(request)
    
    return {
        "galaxies": 9,
        "systemsPerGalaxy": 499,
        "planetsPerSystem": 15,
        "totalPlayers": users_collection.count_documents({}),
        "totalAlliances": alliances_collection.count_documents({})
    }


# ==================== MARKET ENDPOINTS ====================

@app.post("/api/market/order")
async def create_market_order(data: MarketOrder, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    resources = player_state.get("resources", {})
    
    if data.orderType == "sell":
        # Check if player has enough resources
        if resources.get(data.resourceType, 0) < data.quantity:
            raise HTTPException(status_code=400, detail="Not enough resources")
        
        # Deduct resources
        resources[data.resourceType] -= data.quantity
        player_states_collection.update_one(
            {"userId": user_id},
            {"$set": {"resources": resources}}
        )
    
    order = {
        "userId": user_id,
        "resourceType": data.resourceType,
        "quantity": data.quantity,
        "pricePerUnit": data.pricePerUnit,
        "orderType": data.orderType,
        "status": "open",
        "createdAt": get_timestamp()
    }
    
    result = market_orders_collection.insert_one(order)
    order["id"] = str(result.inserted_id)
    
    return serialize_doc(order)


@app.get("/api/market/orders")
async def get_market_orders(request: Request, resource_type: Optional[str] = None):
    session = require_auth(request)
    
    query = {"status": "open"}
    if resource_type:
        query["resourceType"] = resource_type
    
    orders = list(market_orders_collection.find(query).sort("pricePerUnit", 1).limit(100))
    return [serialize_doc(order) for order in orders]


# ==================== MESSAGES ENDPOINTS ====================

@app.post("/api/messages/send")
async def send_message(data: MessageSend, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    message = {
        "senderId": user_id,
        "senderName": session["username"],
        "recipientId": data.recipientId,
        "subject": data.subject,
        "content": data.content,
        "read": False,
        "createdAt": get_timestamp()
    }
    
    result = messages_collection.insert_one(message)
    message["id"] = str(result.inserted_id)
    
    return serialize_doc(message)


@app.get("/api/messages/inbox")
async def get_inbox(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    messages = list(messages_collection.find({"recipientId": user_id}).sort("createdAt", -1).limit(50))
    return [serialize_doc(msg) for msg in messages]


@app.get("/api/messages/sent")
async def get_sent_messages(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    messages = list(messages_collection.find({"senderId": user_id}).sort("createdAt", -1).limit(50))
    return [serialize_doc(msg) for msg in messages]


@app.get("/api/messages")
async def get_all_messages(request: Request, limit: int = 50):
    """Get all messages for user (inbox)"""
    session = require_auth(request)
    user_id = session["userId"]
    
    messages = list(messages_collection.find({"recipientId": user_id}).sort("createdAt", -1).limit(limit))
    return [serialize_doc(msg) for msg in messages]


# ==================== ALLIANCE ENDPOINTS ====================

@app.post("/api/alliances/create")
async def create_alliance(data: AllianceCreate, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    # Check if tag exists
    existing = alliances_collection.find_one({"tag": data.tag})
    if existing:
        raise HTTPException(status_code=400, detail="Alliance tag already exists")
    
    alliance = {
        "name": data.name,
        "tag": data.tag,
        "description": data.description,
        "leaderId": user_id,
        "members": [{"userId": user_id, "role": "leader", "joinedAt": get_timestamp()}],
        "createdAt": get_timestamp()
    }
    
    result = alliances_collection.insert_one(alliance)
    alliance["id"] = str(result.inserted_id)
    
    return serialize_doc(alliance)


@app.get("/api/alliances")
async def get_alliances(request: Request):
    session = require_auth(request)
    
    alliances = list(alliances_collection.find().sort("createdAt", -1).limit(50))
    return [serialize_doc(a) for a in alliances]


@app.post("/api/alliances/{alliance_id}/join")
async def join_alliance(alliance_id: str, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    alliance = alliances_collection.find_one({"_id": ObjectId(alliance_id)})
    if not alliance:
        raise HTTPException(status_code=404, detail="Alliance not found")
    
    # Check if already member
    for member in alliance.get("members", []):
        if member["userId"] == user_id:
            raise HTTPException(status_code=400, detail="Already a member")
    
    alliances_collection.update_one(
        {"_id": ObjectId(alliance_id)},
        {"$push": {"members": {"userId": user_id, "role": "member", "joinedAt": get_timestamp()}}}
    )
    
    return {"success": True}


@app.get("/api/alliances/my")
async def get_my_alliance(request: Request):
    """Get current user's alliance"""
    session = require_auth(request)
    user_id = session["userId"]
    
    alliance = alliances_collection.find_one({"members.userId": user_id})
    if not alliance:
        return {"alliance": None}
    
    return {"alliance": serialize_doc(alliance)}


# ==================== LEADERBOARD ENDPOINTS ====================

@app.get("/api/leaderboard")
async def get_leaderboard(request: Request, limit: int = 100):
    session = require_auth(request)
    
    # Get all player states with user info
    pipeline = [
        {"$lookup": {
            "from": "users",
            "localField": "userId",
            "foreignField": "_id",
            "as": "user"
        }},
        {"$unwind": {"path": "$user", "preserveNullAndEmptyArrays": True}},
        {"$project": {
            "userId": 1,
            "username": "$user.username",
            "planetName": 1,
            "empireLevel": 1,
            "tier": 1,
            "resources": 1,
            "buildings": 1,
            "units": 1
        }},
        {"$limit": limit}
    ]
    
    players = list(player_states_collection.aggregate(pipeline))
    
    # Calculate scores
    leaderboard = []
    for player in players:
        score = calculate_empire_score(player)
        fleet_power = calculate_fleet_power(player.get("units", {}))
        leaderboard.append({
            "userId": str(player.get("userId", player.get("_id"))),
            "username": player.get("username", "Unknown"),
            "planetName": player.get("planetName", "Unknown"),
            "empireLevel": player.get("empireLevel", 1),
            "tier": player.get("tier", 1),
            "score": score,
            "fleetPower": fleet_power
        })
    
    # Sort by score
    leaderboard.sort(key=lambda x: x["score"], reverse=True)
    
    # Add ranks
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    
    return leaderboard


# ==================== STATUS/HEALTH ENDPOINTS ====================

@app.get("/api/status")
async def get_status():
    return {
        "status": "ok",
        "version": "1.0.0",
        "serverTime": get_timestamp().isoformat(),
        "database": "connected"
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "stellar-dominion-api"}


@app.get("/health")
async def root_health():
    return {"status": "ok"}


# ==================== TURN SYSTEM ENDPOINTS ====================

@app.post("/api/turns/process")
async def process_turns(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    # Generate turns based on time
    current_turns = player_state.get("currentTurns", 0)
    total_turns = player_state.get("totalTurns", 0)
    
    # Add turns (6 per minute max)
    new_turns = min(current_turns + 6, 1000)
    
    # Process resource production per turn
    production = calculate_production(player_state.get("buildings", {}))
    resources = player_state.get("resources", {})
    
    turns_to_process = min(new_turns, 10)  # Process up to 10 turns
    for resource, rate in production.items():
        resources[resource] = resources.get(resource, 0) + int(rate * turns_to_process / 60)
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {
            "currentTurns": new_turns - turns_to_process,
            "totalTurns": total_turns + turns_to_process,
            "resources": resources,
            "updatedAt": get_timestamp()
        }}
    )
    
    return {
        "turnsProcessed": turns_to_process,
        "currentTurns": new_turns - turns_to_process,
        "totalTurns": total_turns + turns_to_process,
        "resourcesGained": {r: int(production.get(r, 0) * turns_to_process / 60) for r in resources}
    }


# ==================== EXPEDITION ENDPOINTS ====================

@app.post("/api/expeditions/start")
async def start_expedition(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    data = await request.json()
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    units = player_state.get("units", {})
    ships = data.get("ships", {})
    
    # Verify ships
    for ship_type, count in ships.items():
        if units.get(ship_type, 0) < count:
            raise HTTPException(status_code=400, detail=f"Not enough {ship_type}")
    
    # Remove ships
    for ship_type, count in ships.items():
        units[ship_type] -= count
    
    # Create expedition
    import random
    expedition = {
        "id": str(ObjectId()),
        "type": data.get("expeditionType", "exploration"),
        "ships": ships,
        "status": "in_progress",
        "startTime": get_timestamp(),
        "duration": random.randint(30, 180),  # minutes
        "rewards": None
    }
    
    missions = player_state.get("missions", [])
    missions.append(expedition)
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"units": units, "missions": missions}}
    )
    
    return {"success": True, "expedition": expedition}


# ==================== COMBAT SIMULATION ====================

@app.post("/api/combat/simulate")
async def simulate_combat(request: Request):
    session = require_auth(request)
    
    data = await request.json()
    attacker = data.get("attacker", {})
    defender = data.get("defender", {})
    
    # Simple combat simulation
    attacker_power = calculate_fleet_power(attacker)
    defender_power = calculate_fleet_power(defender)
    
    import random
    attacker_roll = attacker_power * random.uniform(0.8, 1.2)
    defender_roll = defender_power * random.uniform(0.8, 1.2)
    
    if attacker_roll > defender_roll:
        winner = "attacker"
        losses_percent = max(0.1, 1 - (attacker_roll / (attacker_roll + defender_roll)))
    else:
        winner = "defender"
        losses_percent = max(0.1, 1 - (defender_roll / (attacker_roll + defender_roll)))
    
    return {
        "winner": winner,
        "attackerPower": attacker_power,
        "defenderPower": defender_power,
        "lossesPercent": losses_percent,
        "battleLog": [
            f"Battle started: Attacker ({attacker_power} power) vs Defender ({defender_power} power)",
            f"Combat resolved: {winner.capitalize()} wins with {int(losses_percent * 100)}% losses"
        ]
    }


# ==================== SETTINGS ENDPOINTS ====================

@app.get("/api/settings")
async def get_settings(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {}
    
    return {
        "username": user.get("username"),
        "email": user.get("email"),
        "notifications": user.get("notifications", True),
        "theme": user.get("theme", "dark")
    }


@app.put("/api/settings")
async def update_settings(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    data = await request.json()
    
    allowed_fields = ["email", "notifications", "theme"]
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    return {"success": True}


# ==================== OGAME CATALOG ENDPOINTS ====================

@app.get("/api/ogame/catalog")
async def get_ogame_catalog(request: Request):
    return {
        "buildings": list(BUILDING_COSTS.keys()),
        "research": list(RESEARCH_COSTS.keys()),
        "ships": list(SHIP_COSTS.keys()),
        "defense": list(DEFENSE_COSTS.keys())
    }


@app.get("/api/ogame/buildings")
async def get_ogame_buildings(request: Request):
    return BUILDING_COSTS


@app.get("/api/ogame/research")
async def get_ogame_research(request: Request):
    return RESEARCH_COSTS


@app.get("/api/ogame/ships")
async def get_ogame_ships(request: Request):
    return SHIP_COSTS


@app.get("/api/ogame/defense")
async def get_ogame_defense(request: Request):
    return DEFENSE_COSTS


# ==================== DIAGNOSTICS ENDPOINTS ====================

@app.get("/api/diagnostics")
async def get_diagnostics(request: Request):
    session = require_auth(request)
    
    return {
        "serverTime": get_timestamp().isoformat(),
        "database": {
            "status": "connected",
            "collections": {
                "users": users_collection.count_documents({}),
                "playerStates": player_states_collection.count_documents({}),
                "alliances": alliances_collection.count_documents({}),
                "marketOrders": market_orders_collection.count_documents({})
            }
        },
        "activeSessions": len(sessions_store),
        "version": "1.0.0"
    }


# ==================== MEGASTRUCTURES ENDPOINTS ====================

MEGASTRUCTURES = {
    "dysonSphere": {"metal": 5000000, "crystal": 3000000, "deuterium": 1000000, "energy": 100000},
    "ringworld": {"metal": 10000000, "crystal": 5000000, "deuterium": 2000000, "energy": 200000},
    "stellarEngine": {"metal": 8000000, "crystal": 4000000, "deuterium": 3000000, "energy": 150000}
}

@app.get("/api/megastructures")
async def get_megastructures(request: Request):
    session = require_auth(request)
    return MEGASTRUCTURES


@app.post("/api/megastructures/build")
async def build_megastructure(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    data = await request.json()
    structure_type = data.get("type")
    
    if structure_type not in MEGASTRUCTURES:
        raise HTTPException(status_code=400, detail="Invalid megastructure type")
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    cost = MEGASTRUCTURES[structure_type]
    resources = player_state.get("resources", {})
    
    # Check resources
    for resource, amount in cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    # Deduct resources
    for resource, amount in cost.items():
        resources[resource] -= amount
    
    # Add megastructure
    megastructures = player_state.get("megastructures", {})
    megastructures[structure_type] = megastructures.get(structure_type, 0) + 1
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"resources": resources, "megastructures": megastructures}}
    )
    
    return {"success": True, "type": structure_type}


# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
