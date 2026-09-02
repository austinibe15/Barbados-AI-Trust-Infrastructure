
from sqlalchemy.orm import Session

from app.models.risk_event import RiskEvent
from app.services.risk_engine import (
    RiskAssessment,
    assess_credential_event,
)


# ---------------------------------------------------------
# GENERATE RISK REFERENCE
# ---------------------------------------------------------

def generate_risk_reference(db: Session) -> str:
    count = db.query(RiskEvent).count() + 1
    return f"BATI-RISK-{count:06d}"


# ---------------------------------------------------------
# CREATE RISK EVENT
# ---------------------------------------------------------

def create_risk_event(
    db: Session,
    *,
    event_type: str,
    assessment: RiskAssessment | None = None,
    credential_status: str | None = None,
    was_previously_verified: bool = False,
    status: str = "open",
) -> RiskEvent:
    """
    Create and persist a BATI risk event.

    The risk_engine is responsible for calculating the risk
    assessment. This service is responsible for persisting it.

    If an assessment is not supplied, it is calculated here
    using the credential event context.
    """

    # -----------------------------------------------------
    # CALCULATE ASSESSMENT IF NOT ALREADY PROVIDED
    # -----------------------------------------------------

    if assessment is None:
        assessment = assess_credential_event(
            event_type=event_type,
            credential_status=credential_status,
            was_previously_verified=was_previously_verified,
        )

    # -----------------------------------------------------
    # CREATE RISK EVENT
    # -----------------------------------------------------

    risk_event = RiskEvent(
        event_reference=generate_risk_reference(db),
        event_type=event_type,
        risk_score=assessment.score,
        risk_classification=assessment.classification,
        explanation=assessment.explanation,
        status=status,
    )

    # -----------------------------------------------------
    # PERSIST
    # -----------------------------------------------------

    db.add(risk_event)
    db.flush()

    return risk_event
