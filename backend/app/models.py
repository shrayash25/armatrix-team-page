"""
SQLModel database models for the Armatrix Team Page.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class TeamMember(SQLModel, table=True):
    """Represents a team member in the database."""

    __tablename__ = "team_members"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        index=True,
        description="Unique identifier for the team member",
    )
    name: str = Field(..., min_length=1, max_length=100, description="Full name")
    role: str = Field(..., min_length=1, max_length=100, description="Job title / role")
    department: str = Field(
        ..., min_length=1, max_length=50, description="Department name"
    )
    bio: str = Field(..., min_length=1, max_length=1000, description="Short biography")
    photo_url: str = Field(..., description="URL to profile photo")
    linkedin_url: str = Field(..., description="LinkedIn profile URL")
    twitter_url: Optional[str] = Field(default=None, description="Twitter profile URL")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp of creation",
    )
