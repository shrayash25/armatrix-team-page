"""
REST API routes for team member management.
"""

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.crud import create_member, delete_member, get_all_members, get_member_by_id, update_member
from app.database import get_session
from app.schemas import TeamMemberCreate, TeamMemberRead, TeamMemberUpdate

router = APIRouter(prefix="/team", tags=["Team"])


@router.get("/", response_model=list[TeamMemberRead])
def list_team_members(session: Session = Depends(get_session)):
    """Return all team members."""
    return get_all_members(session)


@router.get("/{member_id}", response_model=TeamMemberRead)
def get_team_member(member_id: str, session: Session = Depends(get_session)):
    """Return a single team member by ID."""
    return get_member_by_id(session, member_id)


@router.post("/", response_model=TeamMemberRead, status_code=status.HTTP_201_CREATED)
def add_team_member(
    data: TeamMemberCreate, session: Session = Depends(get_session)
):
    """Create a new team member."""
    return create_member(session, data)


@router.put("/{member_id}", response_model=TeamMemberRead)
def update_team_member(
    member_id: str,
    data: TeamMemberUpdate,
    session: Session = Depends(get_session),
):
    """Update an existing team member."""
    return update_member(session, member_id, data)


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_team_member(member_id: str, session: Session = Depends(get_session)):
    """Delete a team member."""
    delete_member(session, member_id)
