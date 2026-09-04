from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.identity import Identity


router = APIRouter(
    prefix="/api/identities",
    tags=["Identity Management"],
)


# ---------------------------------------------------------
# REQUEST SCHEMAS
# ---------------------------------------------------------

class IdentityCreate(BaseModel):
    full_name: str = Field(min_length=2)
    email: Optional[str] = None
    institution: Optional[str] = None
    role: Optional[str] = None


class IdentityUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    institution: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    trust_level: Optional[str] = None


# ---------------------------------------------------------
# RESPONSE FORMAT
# ---------------------------------------------------------

def identity_response(identity: Identity):
    return {
        "id": identity.id,
        "identity_id": identity.identity_id,
        "full_name": identity.full_name,
        "email": identity.email,
        "institution": identity.institution,
        "role": identity.role,
        "status": identity.status,
        "trust_level": identity.trust_level,
    }


# ---------------------------------------------------------
# LIST IDENTITIES
# ---------------------------------------------------------

@router.get("")
def get_identities(
    db: Session = Depends(get_db),
):
    identities = (
        db.query(Identity)
        .order_by(Identity.id.asc())
        .all()
    )

    return {
        "count": len(identities),
        "items": [
            identity_response(identity)
            for identity in identities
        ],
    }


# ---------------------------------------------------------
# GET SINGLE IDENTITY
# ---------------------------------------------------------

@router.get("/{identity_id}")
def get_identity(
    identity_id: int,
    db: Session = Depends(get_db),
):
    identity = (
        db.query(Identity)
        .filter(Identity.id == identity_id)
        .first()
    )

    if not identity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Identity not found",
        )

    return identity_response(identity)


# ---------------------------------------------------------
# CREATE IDENTITY
# ---------------------------------------------------------

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
def create_identity(
    payload: IdentityCreate,
    db: Session = Depends(get_db),
):
    next_id = (
        db.query(Identity.id)
        .order_by(Identity.id.desc())
        .first()
    )

    new_id = (next_id[0] + 1) if next_id else 1

    identity = Identity(
        identity_id=f"BATI-ID-{new_id:04d}",
        identity_type="individual",
        full_name=payload.full_name,
        email=payload.email,
        institution=payload.institution,
        role=payload.role,
        status="pending",
        trust_level="unverified",
        biometric_verified=False,
    )

    db.add(identity)
    db.commit()
    db.refresh(identity)

    return identity_response(identity)


# ---------------------------------------------------------
# UPDATE IDENTITY
# ---------------------------------------------------------

@router.put("/{identity_id}")
def update_identity(
    identity_id: int,
    payload: IdentityUpdate,
    db: Session = Depends(get_db),
):
    identity = (
        db.query(Identity)
        .filter(Identity.id == identity_id)
        .first()
    )

    if not identity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Identity not found",
        )

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(identity, field, value)

    db.commit()
    db.refresh(identity)

    return identity_response(identity)


# ---------------------------------------------------------
# DELETE IDENTITY
# ---------------------------------------------------------

@router.delete("/{identity_id}")
def delete_identity(
    identity_id: int,
    db: Session = Depends(get_db),
):
    identity = (
        db.query(Identity)
        .filter(Identity.id == identity_id)
        .first()
    )

    if not identity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Identity not found",
        )

    deleted = identity_response(identity)

    db.delete(identity)
    db.commit()

    return {
        "message": "Identity deleted successfully",
        "identity": deleted,
    }