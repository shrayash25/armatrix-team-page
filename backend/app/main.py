"""
Armatrix Team Page – FastAPI Application Entry Point.

Initializes the app, configures CORS, includes routes,
and seeds sample team data on first startup.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.database import create_db_and_tables, engine
from app.models import TeamMember
from app.routes.team import router as team_router

# ---------------------------------------------------------------------------
# Seed data – realistic Armatrix robotics startup team
# ---------------------------------------------------------------------------
SEED_DATA: list[dict] = [
    {
        "name": "Vishrant Dave",
        "role": "Co-founder and CEO",
        "department": "Leadership",
        "bio": "Leading the vision and strategy for Armatrix's deep-tech robotic solutions and autonomous systems.",
        "photo_url": "https://api.dicebear.com/8.x/notionists/svg?seed=vishrant",
        "linkedin_url": "https://linkedin.com/in/vishrantdave",
    },
    {
        "name": "Prateesh Awasthi",
        "role": "Co-founder",
        "department": "Leadership",
        "bio": "Driving innovation and foundational technologies to scale Armatrix's impact in the robotics industry.",
        "photo_url": "https://api.dicebear.com/8.x/notionists/svg?seed=prateesh",
        "linkedin_url": "https://linkedin.com/in/prateeshawasthi",
    },
    {
        "name": "Ayush Ranjan",
        "role": "Co-founder",
        "department": "Leadership",
        "bio": "Shaping the core product roadmap and strategic partnerships to bring Armatrix robots to market.",
        "photo_url": "https://api.dicebear.com/8.x/notionists/svg?seed=ayush",
        "linkedin_url": "https://linkedin.com/in/ayushranjan",
    },
    {
        "name": "Sounak Senapati",
        "role": "Head of Staff",
        "department": "Operations",
        "bio": "Streamlining operations, guiding cross-functional initiatives, and supporting leadership execution across the company.",
        "photo_url": "https://api.dicebear.com/8.x/notionists/svg?seed=sounak",
        "linkedin_url": "https://linkedin.com/in/sounaksenapati",
    },
    {
        "name": "Pulkit Sinha",
        "role": "Founding Engineer",
        "department": "Engineering",
        "bio": "Building the foundational architecture and core software systems powering Armatrix's robotics fleet.",
        "photo_url": "https://api.dicebear.com/8.x/notionists/svg?seed=pulkit",
        "linkedin_url": "https://linkedin.com/in/pulkitsinha",
    },
    {
        "name": "Anushtup Nandy",
        "role": "Founding Engineer",
        "department": "Engineering",
        "bio": "Developing robust engineering solutions from the ground up, focusing on system reliability and performance.",
        "photo_url": "https://api.dicebear.com/8.x/notionists/svg?seed=anushtup",
        "linkedin_url": "https://linkedin.com/in/anushtupnandy",
    },
    {
        "name": "Akshat Khandelwal",
        "role": "Head of Operations",
        "department": "Operations",
        "bio": "Overseeing daily operations, supply chain logistics, and ensuring seamless deployment of robotic systems.",
        "photo_url": "https://api.dicebear.com/8.x/notionists/svg?seed=akshat",
        "linkedin_url": "https://linkedin.com/in/akshatkhandelwal",
    },
    {
        "name": "Shashank Singh Tomar",
        "role": "Mechatronic Engineer",
        "department": "Engineering",
        "bio": "Integrating mechanical, electrical, and software components to build highly precise and responsive robotic actuators.",
        "photo_url": "https://api.dicebear.com/8.x/notionists/svg?seed=shashank",
        "linkedin_url": "https://linkedin.com/in/shashanksinghtomar",
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables and seed data on startup."""
    create_db_and_tables()

    # Seed only if the table is empty
    with Session(engine) as session:
        existing = session.exec(select(TeamMember)).first()
        if not existing:
            for member_data in SEED_DATA:
                session.add(TeamMember(**member_data))
            session.commit()

    yield


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Armatrix Team API",
    description="REST API for the Armatrix robotics startup team page.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow the Next.js frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(team_router)


@app.get("/", tags=["Health"])
def health_check():
    """Simple health-check endpoint."""
    return {"status": "ok", "service": "armatrix-team-api"}
