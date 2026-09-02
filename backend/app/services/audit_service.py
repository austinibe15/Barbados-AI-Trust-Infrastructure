
from sqlalchemy.orm import Session

from app.models.audit import AuditLog


# ---------------------------------------------------------
# GENERATE AUDIT EVENT ID
# ---------------------------------------------------------

def generate_event_id(db: Session) -> str:
    count = db.query(AuditLog).count() + 1
    return f"BATI-AUDIT-{count:06d}"


# ---------------------------------------------------------
# CREATE AUDIT EVENT
# ---------------------------------------------------------

def create_audit_event(
    db: Session,
    *,
    event_type: str,
    entity_type: str,
    entity_id: str,
    action: str,
    description: str | None = None,
    actor_identity_id: int | None = None,
    status: str = "success",
    metadata_json: str | None = None,
) -> AuditLog:

    audit_log = AuditLog(
        event_id=generate_event_id(db),
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        actor_identity_id=actor_identity_id,
        action=action,
        description=description,
        status=status,
        metadata_json=metadata_json,
    )

    db.add(audit_log)
    db.flush()

    return audit_log
