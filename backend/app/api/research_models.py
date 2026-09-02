from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.research_model import ResearchModel
from app.schemas.model import ResearchModelResponse
from app.services.research_service import (
    get_research_model,
    get_research_models,
)


router = APIRouter(
    prefix="/api/research/models",
    tags=["Research Models"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get(
    "",
    response_model=list[ResearchModelResponse],
)
def list_research_models(
    db: Session = Depends(get_db),
):
    return get_research_models(db)


@router.get(
    "/{model_id}",
    response_model=ResearchModelResponse,
)
def read_research_model(
    model_id: int,
    db: Session = Depends(get_db),
):
    model = get_research_model(db, model_id)

    if model is None:
        raise HTTPException(
            status_code=404,
            detail="Research model not found",
        )

    return model