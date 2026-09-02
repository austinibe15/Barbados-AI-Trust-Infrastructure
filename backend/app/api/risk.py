
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.risk_event import RiskEvent
from app.schemas.risk import RiskEventCreate, RiskEventResponse


router = APIRouter(
    prefix="/api/risk",
    tags=["Risk Centre"],
)


# ---------------------------------------------------------
# GENERATE RISK REFERENCE
# ---------------------------------------------------------

def generate_risk_reference(db: Session) -> str:
    count = db.query(RiskEvent).count() + 1
    return f"BATI-RISK-{count:06d}"


# ---------------------------------------------------------
# LIST RISK EVENTS
# ---------------------------------------------------------

@router.get("")
def list_risk_events(
    db: Session = Depends(get_db),
):
    events = (
        db.query(RiskEvent)
        .order_by(RiskEvent.id.desc())
        .all()
    )

    return {
        "count": len(events),
        "items": events,
    }


# ---------------------------------------------------------
# GET SINGLE RISK EVENT
# ---------------------------------------------------------

@router.get(
    "/{risk_id}",
    response_model=RiskEventResponse,
)
def get_risk_event(
    risk_id: int,
    db: Session = Depends(get_db),
):
    risk_event = (
        db.query(RiskEvent)
        .filter(RiskEvent.id == risk_id)
        .first()
    )

    if not risk_event:
        raise HTTPException(
            status_code=404,
            detail="Risk event not found",
        )

    return risk_event


# ---------------------------------------------------------
# CREATE RISK EVENT
# ---------------------------------------------------------

@router.post(
    "",
    response_model=RiskEventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_risk_event(
    payload: RiskEventCreate,
    db: Session = Depends(get_db),
):
    risk_event = RiskEvent(
        event_reference=generate_risk_reference(db),
        event_type=payload.event_type,
        risk_score=payload.risk_score,
        risk_classification=(
            "critical"
            if payload.risk_score >= 75
            else "high"
            if payload.risk_score >= 50
            else "medium"
            if payload.risk_score >= 25
            else "low"
        ),
        explanation=payload.explanation,
        status=payload.status,
    )

    db.add(risk_event)
    db.commit()
    db.refresh(risk_event)

    return risk_event


# ---------------------------------------------------------
# CLOSE RISK EVENT
# ---------------------------------------------------------

@router.post(
    "/{risk_id}/close",
    response_model=RiskEventResponse,
)
def close_risk_event(
    risk_id: int,
    db: Session = Depends(get_db),
):
    risk_event = (
        db.query(RiskEvent)
        .filter(RiskEvent.id == risk_id)
        .first()
    )

    if not risk_event:
        raise HTTPException(
            status_code=404,
            detail="Risk event not found",
        )

    if risk_event.status == "closed":
        raise HTTPException(
            status_code=400,
            detail="Risk event is already closed",
        )

    risk_event.status = "closed"

    db.commit()
    db.refresh(risk_event)

    return risk_event