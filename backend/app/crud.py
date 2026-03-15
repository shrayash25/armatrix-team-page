"""
CRUD operations for team members.
"""

from typing import Optional

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models import TeamMember
from app.schemas import TeamMemberCreate, TeamMemberUpdate


def get_all_members(session: Session) -> list[TeamMember]:
    """Retrieve all team members, ordered by creation date."""
    statement = select(TeamMember).order_by(TeamMember.created_at)
    return list(session.exec(statement).all())


def get_member_by_id(session: Session, member_id: str) -> TeamMember:
    """Retrieve a single team member by ID. Raises 404 if not found."""
    member = session.get(TeamMember, member_id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team member with id '{member_id}' not found",
        )
    return member


def create_member(session: Session, data: TeamMemberCreate) -> TeamMember:
    """Create a new team member and return it."""
    member = TeamMember(**data.model_dump())
    session.add(member)
    session.commit()
    session.refresh(member)
    return member


def update_member(
    session: Session, member_id: str, data: TeamMemberUpdate
) -> TeamMember:
    """Update an existing team member. Only provided fields are changed."""
    member = get_member_by_id(session, member_id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(member, key, value)
    session.add(member)
    session.commit()
    session.refresh(member)
    return member


def delete_member(session: Session, member_id: str) -> None:
    """Delete a team member by ID. Raises 404 if not found."""
    member = get_member_by_id(session, member_id)
    session.delete(member)
    session.commit()
