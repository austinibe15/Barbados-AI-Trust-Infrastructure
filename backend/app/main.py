
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
        check_database()

        Base.metadata.create_all(bind=engine)

        print("BATI database tables verified.")

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
