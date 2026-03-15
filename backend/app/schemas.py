"""
Pydantic schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class TeamMemberCreate(BaseModel):
    """Schema for creating a new team member."""

    name: str = Field(..., min_length=1, max_length=100)
    role: str = Field(..., min_length=1, max_length=100)
    department: str = Field(..., min_length=1, max_length=50)
    bio: str = Field(..., min_length=1, max_length=1000)
    photo_url: str = Field(...)
    linkedin_url: str = Field(...)
    twitter_url: Optional[str] = None


class TeamMemberUpdate(BaseModel):
    """Schema for updating an existing team member. All fields optional."""

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[str] = Field(None, min_length=1, max_length=100)
    department: Optional[str] = Field(None, min_length=1, max_length=50)
    bio: Optional[str] = Field(None, min_length=1, max_length=1000)
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None


class TeamMemberRead(BaseModel):
    """Schema for reading a team member (API response)."""

    id: str
    name: str
    role: str
    department: str
    bio: str
    photo_url: str
    linkedin_url: str
    twitter_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
