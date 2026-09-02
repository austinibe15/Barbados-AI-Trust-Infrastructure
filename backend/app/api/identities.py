from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional


router = APIRouter(
    prefix="/api/identities",
    tags=["Identity Management"],
)


class IdentityCreate(BaseModel):
    full_name: str = Field(min_length=2)
    email: str
    institution: Optional[str] = None
    role: Optional[str] = None


class IdentityUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    institution: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None


identities = [
    {
        "id": 1,
        "identity_id": "BATI-ID-0001",
        "full_name": "Research Administrator",
        "email": "administrator@bati.local",
        "institution": "BATI Research Environment",
        "role": "Administrator",
        "status": "verified",
    },
    {
        "id": 2,
        "identity_id": "BATI-ID-0002",
        "full_name": "Institutional Researcher",
        "email": "researcher@bati.local",
        "institution": "Research Institution",
        "role": "Researcher",
        "status": "verified",
    },
]


@router.get("")
def get_identities():
    return {
        "count": len(identities),
        "items": identities,
    }


@router.get("/{identity_id}")
def get_identity(identity_id: int):
    for identity in identities:
        if identity["id"] == identity_id:
            return identity

    raise HTTPException(
        status_code=404,
        detail="Identity not found",
    )


@router.post("", status_code=201)
def create_identity(identity: IdentityCreate):

    new_id = max(
        [item["id"] for item in identities],
        default=0,
    ) + 1

    new_identity = {
        "id": new_id,
        "identity_id": f"BATI-ID-{new_id:04d}",
        "full_name": identity.full_name,
        "email": identity.email,
        "institution": identity.institution,
        "role": identity.role,
        "status": "pending",
    }

    identities.append(new_identity)

    return new_identity


@router.put("/{identity_id}")
def update_identity(
    identity_id: int,
    identity: IdentityUpdate,
):

    for existing in identities:

        if existing["id"] == identity_id:

            update_data = identity.model_dump(
                exclude_unset=True
            )

            existing.update(update_data)

            return existing

    raise HTTPException(
        status_code=404,
        detail="Identity not found",
    )


@router.delete("/{identity_id}")
def delete_identity(identity_id: int):

    for index, identity in enumerate(identities):

        if identity["id"] == identity_id:

            deleted = identities.pop(index)

            return {
                "message": "Identity deleted successfully",
                "identity": deleted,
            }

    raise HTTPException(
        status_code=404,
        detail="Identity not found",
    )