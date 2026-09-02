from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResearchModelBase(BaseModel):
    model_reference: str
    name: str
    version: str
    model_type: str
    description: str | None = None
    status: str = "registered"


class ResearchModelResponse(ResearchModelBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )