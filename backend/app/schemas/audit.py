
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ---------------------------------------------------------
# AUDIT LOG CREATE
# ---------------------------------------------------------

class AuditLogCreate(BaseModel):
    event_type: str
    entity_type: str
    entity_id: str

    actor_identity_id: int | None = None

    action: str
    description: str | None = None

    status: str = "success"

    metadata_json: str | None = None


# ---------------------------------------------------------
# AUDIT LOG RESPONSE
# ---------------------------------------------------------

class AuditLogResponse(BaseModel):
    id: int
    event_id: str

    event_type: str
    entity_type: str
    entity_id: str

    actor_identity_id: int | None = None

    action: str
    description: str | None = None

    status: str
    metadata_json: str | None = None

    timestamp: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
