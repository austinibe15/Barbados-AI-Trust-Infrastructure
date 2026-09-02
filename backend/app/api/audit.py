from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogCreate, AuditLogResponse


router = APIRouter(
    prefix="/api/audit",
    tags=["Audit Trail"],
)


def generate_event_id(db: Session) -> str:
    count = db.query(AuditLog).count() + 1
    return f"BATI-AUDIT-{count:06d}"


# ---------------------------------------------------------
# LIST AUDIT EVENTS
# ---------------------------------------------------------

@router.get(
    "",
    response_model=list[AuditLogResponse],
)
def list_audit_logs(
    db: Session = Depends(get_db),
):
    return (
        db.query(AuditLog)
        .order_by(AuditLog.id.desc())
        .all()
    )


# ---------------------------------------------------------
# GET SINGLE AUDIT EVENT
# ---------------------------------------------------------

@router.get(
    "/{audit_id}",
    response_model=AuditLogResponse,
)
def get_audit_log(
    audit_id: int,
    db: Session = Depends(get_db),
):
    audit_log = (
        db.query(AuditLog)
        .filter(AuditLog.id == audit_id)
        .first()
    )

    if not audit_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit event not found",
        )

    return audit_log


# ---------------------------------------------------------
# CREATE AUDIT EVENT
# ---------------------------------------------------------

@router.post(
    "",
    response_model=AuditLogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_audit_log(
    payload: AuditLogCreate,
    db: Session = Depends(get_db),
):
    audit_log = AuditLog(
        event_id=generate_event_id(db),
        event_type=payload.event_type,
        entity_type=payload.entity_type,
        entity_id=payload.entity_id,
        actor_identity_id=payload.actor_identity_id,
        action=payload.action,
        description=payload.description,
        status=payload.status,
        metadata_json=payload.metadata_json,
    )

    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)

    return audit_log