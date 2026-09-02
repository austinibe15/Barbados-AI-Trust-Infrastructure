from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RiskEventCreate(BaseModel):
    event_type: str
    risk_score: float = Field(..., ge=0, le=100)
    explanation: Optional[str] = None
    status: str = "open"


class RiskEventResponse(BaseModel):
    id: int
    event_reference: str
    event_type: str
    risk_score: float
    risk_classification: str
    explanation: Optional[str] = None
    status: str
    detected_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )