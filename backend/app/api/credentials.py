
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.credential import Credential
from app.schemas.credential import (
    CredentialCreate,
    CredentialResponse,
)

from app.services.audit_service import create_audit_event
from app.services.risk_engine import assess_credential_event
from app.services.risk_service import create_risk_event


router = APIRouter(
    prefix="/api/credentials",
    tags=["Credentials"],
)


# ---------------------------------------------------------
# GENERATE CREDENTIAL ID
# ---------------------------------------------------------

def generate_credential_id(db: Session) -> str:
    count = db.query(Credential).count() + 1
    return f"BATI-CRED-{count:04d}"


# ---------------------------------------------------------
# GENERATE SUBJECT
# ---------------------------------------------------------

def generate_credential_subject(identity_id: int) -> str:
    """
    Generate the credential subject from the BATI identity.

    Example:
        identity_id=1
        -> BATI-ID-0001
    """
    return f"BATI-ID-{identity_id:04d}"


# ---------------------------------------------------------
# LIST CREDENTIALS
# ---------------------------------------------------------

@router.get("")
def list_credentials(
    db: Session = Depends(get_db),
):
    credentials = (
        db.query(Credential)
        .order_by(Credential.id.desc())
        .all()
    )

    return {
        "count": len(credentials),
        "items": credentials,
    }


# ---------------------------------------------------------
# GET SINGLE CREDENTIAL
# ---------------------------------------------------------

@router.get(
    "/{credential_id}",
    response_model=CredentialResponse,
)
def get_credential(
    credential_id: int,
    db: Session = Depends(get_db),
):
    credential = (
        db.query(Credential)
        .filter(Credential.id == credential_id)
        .first()
    )

    if not credential:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credential not found",
        )

    return credential


# ---------------------------------------------------------
# CREATE CREDENTIAL
# ---------------------------------------------------------

@router.post(
    "",
    response_model=CredentialResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_credential(
    payload: CredentialCreate,
    db: Session = Depends(get_db),
):
    # -----------------------------------------------------
    # GENERATE IDENTIFIERS
    # -----------------------------------------------------

    credential_id = generate_credential_id(db)

    subject = generate_credential_subject(
        payload.identity_id
    )

    # -----------------------------------------------------
    # CREATE CREDENTIAL
    # -----------------------------------------------------

    credential = Credential(
        credential_id=credential_id,
        identity_id=payload.identity_id,
        credential_type=payload.credential_type,
        issuer=payload.issuer,
        subject=subject,
        status="active",
        trust_level=payload.trust_level,
        expires_at=payload.expires_at,
        metadata_json=payload.metadata_json,
    )

    db.add(credential)
    db.flush()

    # -----------------------------------------------------
    # RISK ASSESSMENT
    # -----------------------------------------------------

    assessment = assess_credential_event(
        event_type="CREDENTIAL_CREATED",
        credential_status=credential.status,
    )

    create_risk_event(
        db,
        event_type="CREDENTIAL_CREATED",
        credential_status=credential.status,
        assessment=assessment,
        status="open",
    )

    # -----------------------------------------------------
    # AUDIT EVENT
    # -----------------------------------------------------

    create_audit_event(
        db,
        event_type="CREDENTIAL_CREATED",
        entity_type="CREDENTIAL",
        entity_id=credential.credential_id,
        actor_identity_id=credential.identity_id,
        action="CREATE",
        description=(
            f"Credential {credential.credential_id} "
            f"created for identity {subject}"
        ),
        status="success",
    )

    # -----------------------------------------------------
    # COMMIT
    # -----------------------------------------------------

    db.commit()
    db.refresh(credential)

    return credential


# ---------------------------------------------------------
# VERIFY CREDENTIAL
# ---------------------------------------------------------

@router.post(
    "/{credential_id}/verify",
    response_model=CredentialResponse,
)
def verify_credential(
    credential_id: int,
    db: Session = Depends(get_db),
):
    credential = (
        db.query(Credential)
        .filter(Credential.id == credential_id)
        .first()
    )

    if not credential:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credential not found",
        )

    # -----------------------------------------------------
    # REVOKED CREDENTIAL
    # -----------------------------------------------------

    if credential.status == "revoked":

        assessment = assess_credential_event(
            event_type="CREDENTIAL_VERIFICATION",
            credential_status="revoked",
        )

        create_risk_event(
            db,
            event_type="CREDENTIAL_VERIFICATION",
            credential_status="revoked",
            was_previously_verified=(
                credential.verified_at is not None
            ),
            assessment=assessment,
            status="open",
        )

        create_audit_event(
            db,
            event_type="CREDENTIAL_VERIFICATION_FAILED",
            entity_type="CREDENTIAL",
            entity_id=credential.credential_id,
            actor_identity_id=credential.identity_id,
            action="VERIFY",
            description=(
                f"Verification was rejected because credential "
                f"{credential.credential_id} is revoked."
            ),
            status="failed",
        )

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Revoked credentials cannot be verified",
        )

    # -----------------------------------------------------
    # EXPIRED CREDENTIAL
    # -----------------------------------------------------

    if (
        credential.expires_at is not None
        and credential.expires_at < datetime.utcnow()
    ):

        assessment = assess_credential_event(
            event_type="CREDENTIAL_VERIFICATION",
            credential_status="expired",
        )

        create_risk_event(
            db,
            event_type="CREDENTIAL_VERIFICATION",
            credential_status="expired",
            was_previously_verified=(
                credential.verified_at is not None
            ),
            assessment=assessment,
            status="open",
        )

        create_audit_event(
            db,
            event_type="CREDENTIAL_VERIFICATION_FAILED",
            entity_type="CREDENTIAL",
            entity_id=credential.credential_id,
            actor_identity_id=credential.identity_id,
            action="VERIFY",
            description=(
                f"Verification was rejected because credential "
                f"{credential.credential_id} is expired."
            ),
            status="failed",
        )

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expired credentials cannot be verified",
        )

    # -----------------------------------------------------
    # DETERMINE PREVIOUS VERIFICATION STATE
    # -----------------------------------------------------

    was_previously_verified = (
        credential.verified_at is not None
        or credential.status == "verified"
    )

    # -----------------------------------------------------
    # UPDATE CREDENTIAL
    # -----------------------------------------------------

    credential.status = "verified"
    credential.verified_at = datetime.utcnow()

    # -----------------------------------------------------
    # RISK ASSESSMENT
    # -----------------------------------------------------

    assessment = assess_credential_event(
        event_type="CREDENTIAL_VERIFICATION",
        credential_status="verified",
        was_previously_verified=was_previously_verified,
    )

    create_risk_event(
        db,
        event_type="CREDENTIAL_VERIFICATION",
        credential_status="verified",
        was_previously_verified=was_previously_verified,
        assessment=assessment,
        status="open",
    )

    # -----------------------------------------------------
    # AUDIT EVENT
    # -----------------------------------------------------

    create_audit_event(
        db,
        event_type="CREDENTIAL_VERIFIED",
        entity_type="CREDENTIAL",
        entity_id=credential.credential_id,
        actor_identity_id=credential.identity_id,
        action="VERIFY",
        description=(
            f"Credential {credential.credential_id} "
            f"was successfully verified."
        ),
        status="success",
    )

    # -----------------------------------------------------
    # COMMIT
    # -----------------------------------------------------

    db.commit()
    db.refresh(credential)

    return credential


# ---------------------------------------------------------
# REVOKE CREDENTIAL
# ---------------------------------------------------------

@router.post(
    "/{credential_id}/revoke",
    response_model=CredentialResponse,
)
def revoke_credential(
    credential_id: int,
    db: Session = Depends(get_db),
):
    credential = (
        db.query(Credential)
        .filter(Credential.id == credential_id)
        .first()
    )

    if not credential:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credential not found",
        )

    # -----------------------------------------------------
    # ALREADY REVOKED
    # -----------------------------------------------------

    if credential.status == "revoked":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credential is already revoked",
        )

    # -----------------------------------------------------
    # DETERMINE PREVIOUS VERIFICATION STATE
    # -----------------------------------------------------

    was_previously_verified = (
        credential.verified_at is not None
        or credential.status == "verified"
    )

    # -----------------------------------------------------
    # UPDATE CREDENTIAL
    # -----------------------------------------------------

    credential.status = "revoked"
    credential.revoked_at = datetime.utcnow()

    # -----------------------------------------------------
    # RISK ASSESSMENT
    # -----------------------------------------------------

    assessment = assess_credential_event(
        event_type="CREDENTIAL_REVOCATION",
        credential_status="revoked",
        was_previously_verified=was_previously_verified,
    )

    create_risk_event(
        db,
        event_type="CREDENTIAL_REVOCATION",
        credential_status="revoked",
        was_previously_verified=was_previously_verified,
        assessment=assessment,
        status="open",
    )

    # -----------------------------------------------------
    # AUDIT EVENT
    # -----------------------------------------------------

    create_audit_event(
        db,
        event_type="CREDENTIAL_REVOKED",
        entity_type="CREDENTIAL",
        entity_id=credential.credential_id,
        actor_identity_id=credential.identity_id,
        action="REVOKE",
        description=(
            f"Credential {credential.credential_id} "
            f"was revoked."
        ),
        status="success",
    )

    # -----------------------------------------------------
    # COMMIT
    # -----------------------------------------------------

    db.commit()
    db.refresh(credential)

    return credential
