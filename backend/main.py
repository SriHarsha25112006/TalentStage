from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import init_db_indexes
from api.routes import auth, portfolio, projects, proposals, contracts, skills

app = FastAPI(title="TalentStage V2 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["portfolio"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["Proposals"])
app.include_router(contracts.router, prefix="/api/contracts", tags=["Contracts"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])

@app.on_event("startup")
async def on_startup():
    await init_db_indexes()

@app.get("/")
async def root():
    return {"message": "Welcome to TalentStage V2 API"}
