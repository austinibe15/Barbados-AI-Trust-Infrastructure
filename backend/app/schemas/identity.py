from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class IdentityBase(BaseModel):
    full_name: str
    email: EmailStr | None = None
    identity_type: str = "individual"
    institution: str | None = None
    status: str = "pending"
    trust_level: str = "unverified"
    biometric_verified: bool = False
    notes: str | None = None


class IdentityCreate(IdentityBase):
    pass


class IdentityUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    identity_type: str | None = None
    institution: str | None = None
    status: str | None = None
    trust_level: str | None = None
    biometric_verified: bool | None = None
    notes: str | None = None


class IdentityResponse(IdentityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    identity_reference: str
    created_at: datetime
    updated_at: datetime