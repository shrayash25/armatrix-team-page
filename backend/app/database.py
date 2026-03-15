"""
Database engine and session management for SQLite via SQLModel.
"""

from sqlmodel import Session, SQLModel, create_engine

DATABASE_URL = "sqlite:///./team.db"

engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def create_db_and_tables() -> None:
    """Create all database tables from SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency that yields a database session."""
    with Session(engine) as session:
        yield session
