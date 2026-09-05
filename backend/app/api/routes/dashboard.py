
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.credential import Credential
from app.models.identity import Identity
from app.models.institution import Institution
from app.models.risk_event import RiskEvent

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


# ---------------------------------------------------------
# DASHBOARD SUMMARY
# ---------------------------------------------------------

@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
):
    # Active identities
    active_identities = (
        db.query(func.count(Identity.id))
        .filter(Identity.status == "active")
        .scalar()
        or 0
    )

    # Verified credentials
    verified_credentials = (
        db.query(func.count(Credential.id))
        .filter(Credential.status == "verified")
        .scalar()
        or 0
    )

    # Active institutions
    active_institutions = (
        db.query(func.count(Institution.id))
        .filter(Institution.is_active.is_(True))
        .scalar()
        or 0
    )

    # Open risk events
    open_risks = (
        db.query(func.count(RiskEvent.id))
        .filter(RiskEvent.status == "open")
        .scalar()
        or 0
    )

    # -----------------------------------------------------
    # Verification rate
    # -----------------------------------------------------

    total_credentials = (
        db.query(func.count(Credential.id))
        .scalar()
        or 0
    )

    if total_credentials:
        verification_rate = round(
            (verified_credentials / total_credentials) * 100,
            1,
        )
    else:
        verification_rate = 0.0

    # -----------------------------------------------------
    # Trust score
    #
    # Research/prototype indicator based on:
    # - verified credentials
    # - active identities
    # - open risks
    #
    # This is intentionally derived from database state rather
    # than being a hard-coded value.
    # -----------------------------------------------------

    if active_identities:
        verified_ratio = (
            verified_credentials / active_identities
        )
    else:
        verified_ratio = 0.0

    risk_penalty = min(open_risks * 2, 40)

    trust_score = round(
        max(
            0,
            min(
                100,
                (verified_ratio * 100) - risk_penalty,
            ),
        ),
        1,
    )

    # -----------------------------------------------------
    # Compliance rate
    #
    # Percentage of credentials that are currently valid:
    # active or verified.
    # -----------------------------------------------------

    valid_credentials = (
        db.query(func.count(Credential.id))
        .filter(
            Credential.status.in_(
                ["active", "verified"]
            )
        )
        .scalar()
        or 0
    )

    if total_credentials:
        compliance_rate = round(
            (valid_credentials / total_credentials) * 100,
            1,
        )
    else:
        compliance_rate = 0.0

    # -----------------------------------------------------
    # Accountability score
    #
    # Percentage of risk events that are not currently open.
    # If there are no risk events, the system starts at 100.
    # -----------------------------------------------------

    total_risk_events = (
        db.query(func.count(RiskEvent.id))
        .scalar()
        or 0
    )

    if total_risk_events:
        resolved_risk_events = (
            db.query(func.count(RiskEvent.id))
            .filter(RiskEvent.status != "open")
            .scalar()
            or 0
        )

        accountability_score = round(
            (resolved_risk_events / total_risk_events) * 100,
            1,
        )
    else:
        accountability_score = 100.0

    return {
        "system_status": "operational",
        "trust_score": trust_score,
        "active_identities": active_identities,
        "verified_credentials": verified_credentials,
        "active_institutions": active_institutions,
        "open_risks": open_risks,
        "compliance_rate": compliance_rate,
        "accountability_score": accountability_score,
    }


# ---------------------------------------------------------
# RISK DISTRIBUTION
# ---------------------------------------------------------

@router.get("/risk-distribution")
def risk_distribution(
    db: Session = Depends(get_db),
):
    classifications = [
        ("Low", "low"),
        ("Medium", "medium"),
        ("High", "high"),
        ("Critical", "critical"),
    ]

    total = (
        db.query(func.count(RiskEvent.id))
        .scalar()
        or 0
    )

    distribution = []

    for label, classification in classifications:
        count = (
            db.query(func.count(RiskEvent.id))
            .filter(
                RiskEvent.risk_classification
                == classification
            )
            .scalar()
            or 0
        )

        percentage = (
            round((count / total) * 100, 1)
            if total
            else 0.0
        )

        distribution.append(
            {
                "level": label,
                "count": count,
                "percentage": percentage,
            }
        )

    return {
        "distribution": distribution,
        "total": total,
    }


# ---------------------------------------------------------
# RECENT EVENTS
# ---------------------------------------------------------

@router.get("/recent-events")
def recent_events(
    db: Session = Depends(get_db),
):
    events = (
        db.query(RiskEvent)
        .order_by(RiskEvent.detected_at.desc())
        .limit(10)
        .all()
    )

    return {
        "events": [
            {
                "id": event.event_reference,
                "type": event.event_type,
                "description": event.explanation
                or "Risk event detected",
                "severity": event.risk_classification,
                "status": event.status,
                "timestamp": (
                    event.detected_at.isoformat()
                    if event.detected_at
                    else datetime.utcnow().isoformat()
                ),
            }
            for event in events
        ]
    }


# ---------------------------------------------------------
# TRUST PIPELINE
# ---------------------------------------------------------

@router.get("/trust-pipeline")
def trust_pipeline(
    db: Session = Depends(get_db),
):
    # -----------------------------------------------------
    # Identity stage
    # -----------------------------------------------------

    identity_count = (
        db.query(func.count(Identity.id))
        .scalar()
        or 0
    )

    # -----------------------------------------------------
    # Verification stage
    # -----------------------------------------------------

    verified_count = (
        db.query(func.count(Credential.id))
        .filter(Credential.status == "verified")
        .scalar()
        or 0
    )

    # -----------------------------------------------------
    # Risk assessment stage
    #
    # Credentials that have an associated risk assessment
    # are represented by the number of risk events.
    # -----------------------------------------------------

    risk_count = (
        db.query(func.count(RiskEvent.id))
        .scalar()
        or 0
    )

    # -----------------------------------------------------
    # Governance stage
    #
    # Active institutions represent the governance layer.
    # -----------------------------------------------------

    governance_count = (
        db.query(func.count(Institution.id))
        .filter(Institution.is_active.is_(True))
        .scalar()
        or 0
    )

    # -----------------------------------------------------
    # Accountability stage
    #
    # Risk events that are no longer open represent events
    # that have reached a resolved/accountability state.
    # -----------------------------------------------------

    accountability_count = (
        db.query(func.count(RiskEvent.id))
        .filter(RiskEvent.status != "open")
        .scalar()
        or 0
    )

    return {
        "pipeline": [
            {
                "stage": "Identity",
                "value": identity_count,
                "status": "active",
            },
            {
                "stage": "Verification",
                "value": verified_count,
                "status": "active",
            },
            {
                "stage": "Risk Assessment",
                "value": risk_count,
                "status": "active",
            },
            {
                "stage": "Governance",
                "value": governance_count,
                "status": "active",
            },
            {
                "stage": "Accountability",
                "value": accountability_count,
                "status": "active",
            },
        ]
    }

