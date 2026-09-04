from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.dashboard import router as dashboard_router
from app.api.identities import router as identities_router
from app.api.credentials import router as credentials_router
from app.api.audit import router as audit_router
from app.api.risk import router as risk_router
from app.api.search import router as search_router
from app.api.research_models import router as research_models_router

from app.core.database import (
    Base,
    engine,
    SessionLocal,
    check_database,
)

from app.models import (
    AuditLog,
    Credential,
    Identity,
    Institution,
    RiskEvent,
)


# ---------------------------------------------------------
# APPLICATION
# ---------------------------------------------------------

app = FastAPI(
    title="Barbados AI Trust Infrastructure",
    description=(
        "Research API for privacy-preserving digital identity, "
        "AI-assisted risk detection, explainability and accountability."
    ),
    version="0.1.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://barbados-ai-trust-infrastructure.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# API ROUTERS
# ---------------------------------------------------------

app.include_router(dashboard_router)

app.include_router(identities_router)

app.include_router(credentials_router)

app.include_router(audit_router)

app.include_router(risk_router)

app.include_router(search_router)

app.include_router(research_models_router)


# ---------------------------------------------------------
# DATABASE INITIALIZATION
# ---------------------------------------------------------

@app.on_event("startup")
def startup():
    print("Starting BATI database initialization...")

    try:
        # -------------------------------------------------
        # CHECK DATABASE CONNECTION
        # -------------------------------------------------

        check_database()

        # -------------------------------------------------
        # CREATE DATABASE TABLES
        # -------------------------------------------------

        Base.metadata.create_all(bind=engine)

        # -------------------------------------------------
        # SEED INITIAL BATI RESEARCH IDENTITIES
        # -------------------------------------------------

        db = SessionLocal()

        try:
            initial_identities = [
                {
                    "identity_id": "BATI-ID-0001",
                    "identity_type": "individual",
                    "full_name": "Research Administrator",
                    "email": "administrator@bati.local",
                    "institution": "BATI Research Environment",
                    "role": "Administrator",
                    "status": "active",
                    "trust_level": "high",
                    "biometric_verified": False,
                },
                {
                    "identity_id": "BATI-ID-0002",
                    "identity_type": "individual",
                    "full_name": "Research User",
                    "email": "researcher@bati.local",
                    "institution": "BATI Research Environment",
                    "role": "Researcher",
                    "status": "active",
                    "trust_level": "high",
                    "biometric_verified": False,
                },
            ]

            for identity_data in initial_identities:

                existing = (
                    db.query(Identity)
                    .filter(
                        Identity.identity_id
                        == identity_data["identity_id"]
                    )
                    .first()
                )

                if not existing:
                    db.add(
                        Identity(**identity_data)
                    )

            db.commit()

        finally:
            db.close()

        print("BATI database tables verified.")
        print("BATI initial identities verified.")

    except Exception as exc:
        print(f"BATI DATABASE ERROR: {exc}")
        raise


# ---------------------------------------------------------
# ROOT
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "BATI",
        "full_name": "Barbados AI Trust Infrastructure",
        "status": "operational",
        "environment": "research",
        "version": "0.1.0",
    }


# ---------------------------------------------------------
# HEALTH
# ---------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "BATI API",
    }


# ---------------------------------------------------------
# DATABASE DEBUG
# ---------------------------------------------------------

@app.get("/debug/database")
def debug_database():
    db = SessionLocal()

    try:
        identities = db.query(Identity).all()

        return {
            "database": "BATI",
            "identity_count": len(identities),
            "identities": [
                {
                    "id": identity.id,
                    "identity_id": identity.identity_id,
                    "full_name": identity.full_name,
                    "email": identity.email,
                    "institution": identity.institution,
                    "role": identity.role,
                    "status": identity.status,
                    "trust_level": identity.trust_level,
                }
                for identity in identities
            ],
        }

    finally:
        db.close()