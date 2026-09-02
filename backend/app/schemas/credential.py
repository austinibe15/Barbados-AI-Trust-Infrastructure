from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ---------------------------------------------------------
# CREDENTIAL CREATE
# ---------------------------------------------------------

class CredentialCreate(BaseModel):
    identity_id: int
    credential_type: str
    issuer: str = "BATI"
    trust_level: str = "medium"
    expires_at: Optional[datetime] = None
    metadata_json: Optional[str] = None


# ---------------------------------------------------------
# CREDENTIAL UPDATE
# ---------------------------------------------------------

class CredentialUpdate(BaseModel):
    credential_type: Optional[str] = None
    issuer: Optional[str] = None
    subject: Optional[str] = None
    status: Optional[str] = None
    trust_level: Optional[str] = None
    expires_at: Optional[datetime] = None
    metadata_json: Optional[str] = None


# ---------------------------------------------------------
# CREDENTIAL RESPONSE
# ---------------------------------------------------------

class CredentialResponse(BaseModel):
    id: int
    credential_id: str
    identity_id: int
    credential_type: str
    issuer: str
    subject: str
    status: str
    trust_level: str
    issued_at: datetime
    expires_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None
    metadata_json: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True
    )