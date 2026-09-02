
from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.identity import Identity
from app.models.credential import Credential
from app.models.risk_event import RiskEvent
from app.models.audit import AuditLog


router = APIRouter(
    prefix="/api/search",
    tags=["Search"],
)


@router.get("")
def search_infrastructure(
    q: str = Query(..., min_length=1, max_length=100),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    query = q.strip()

    if not query:
        return {
            "query": q,
            "count": 0,
            "items": [],
        }

    pattern = f"%{query}%"

    results = []

    # ---------------------------------------------------------
    # IDENTITIES
    # ---------------------------------------------------------

    identities = (
        db.query(Identity)
        .filter(
            or_(
                Identity.identity_id.ilike(pattern),
                Identity.full_name.ilike(pattern),
                Identity.email.ilike(pattern),
                Identity.institution.ilike(pattern),
                Identity.role.ilike(pattern),
                Identity.status.ilike(pattern),
            )
        )
        .order_by(Identity.id.desc())
        .limit(limit)
        .all()
    )

    for identity in identities:
        results.append(
            {
                "type": "identity",
                "id": identity.id,
                "reference": identity.identity_id,
                "title": identity.full_name,
                "description": (
                    f"{identity.institution} • "
                    f"{identity.role} • "
                    f"{identity.status}"
                ),
                "route": "/identity",
            }
        )

    # ---------------------------------------------------------
    # CREDENTIALS
    # ---------------------------------------------------------

    credentials = (
        db.query(Credential)
        .filter(
            or_(
                Credential.credential_id.ilike(pattern),
                Credential.credential_type.ilike(pattern),
                Credential.issuer.ilike(pattern),
                Credential.subject.ilike(pattern),
                Credential.status.ilike(pattern),
                Credential.trust_level.ilike(pattern),
            )
        )
        .order_by(Credential.id.desc())
        .limit(limit)
        .all()
    )

    for credential in credentials:
        results.append(
            {
                "type": "credential",
                "id": credential.id,
                "reference": credential.credential_id,
                "title": credential.credential_type,
                "description": (
                    f"Issuer: {credential.issuer} • "
                    f"Status: {credential.status} • "
                    f"Trust: {credential.trust_level}"
                ),
                "route": "/identity/credentials",
            }
        )

    # ---------------------------------------------------------
    # RISK EVENTS
    # ---------------------------------------------------------

    risk_events = (
        db.query(RiskEvent)
        .filter(
            or_(
                RiskEvent.event_reference.ilike(pattern),
                RiskEvent.event_type.ilike(pattern),
                RiskEvent.risk_classification.ilike(pattern),
                RiskEvent.status.ilike(pattern),
                RiskEvent.explanation.ilike(pattern),
            )
        )
        .order_by(RiskEvent.id.desc())
        .limit(limit)
        .all()
    )

    for event in risk_events:
        results.append(
            {
                "type": "risk",
                "id": event.id,
                "reference": event.event_reference,
                "title": event.event_type,
                "description": (
                    f"{event.risk_classification} risk • "
                    f"Score: {event.risk_score} • "
                    f"Status: {event.status}"
                ),
                "route": "/intelligence/risk-centre",
            }
        )

    # ---------------------------------------------------------
    # AUDIT LOGS
    # ---------------------------------------------------------

    audit_logs = (
        db.query(AuditLog)
        .filter(
            or_(
                AuditLog.event_id.ilike(pattern),
                AuditLog.event_type.ilike(pattern),
                AuditLog.entity_type.ilike(pattern),
                AuditLog.entity_id.ilike(pattern),
                AuditLog.action.ilike(pattern),
                AuditLog.description.ilike(pattern),
                AuditLog.status.ilike(pattern),
            )
        )
        .order_by(AuditLog.id.desc())
        .limit(limit)
        .all()
    )

    for audit_log in audit_logs:
        results.append(
            {
                "type": "audit",
                "id": audit_log.id,
                "reference": audit_log.event_id,
                "title": audit_log.event_type,
                "description": (
                    f"{audit_log.action} • "
                    f"{audit_log.entity_type} • "
                    f"{audit_log.status}"
                ),
                "route": "/governance/audit-trail",
            }
        )

    # ---------------------------------------------------------
    # GLOBAL RESULT LIMIT
    # ---------------------------------------------------------

    results = results[:limit]

    return {
        "query": query,
        "count": len(results),
        "items": results,
    }

