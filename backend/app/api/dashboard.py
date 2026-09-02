from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
):
    return {
        "system_status": "operational",
        "trust_score": 87.4,
        "active_identities": 1248,
        "verified_credentials": 936,
        "active_institutions": 24,
        "open_risks": 18,
        "compliance_rate": 94.2,
        "accountability_score": 91.7,
    }


@router.get("/risk-distribution")
def risk_distribution(
    db: Session = Depends(get_db),
):
    return {
        "distribution": [
            {
                "level": "Low",
                "count": 72,
                "percentage": 60.0,
            },
            {
                "level": "Medium",
                "count": 31,
                "percentage": 25.8,
            },
            {
                "level": "High",
                "count": 12,
                "percentage": 10.0,
            },
            {
                "level": "Critical",
                "count": 5,
                "percentage": 4.2,
            },
        ],
        "total": 120,
    }


@router.get("/recent-events")
def recent_events(
    db: Session = Depends(get_db),
):
    return {
        "events": [
            {
                "id": "EVT-001",
                "type": "Identity Verification",
                "description": (
                    "Institutional identity successfully verified"
                ),
                "severity": "low",
                "status": "completed",
                "timestamp": "2026-08-24T14:42:00Z",
            },
            {
                "id": "EVT-002",
                "type": "Risk Detection",
                "description": (
                    "Anomalous access pattern detected"
                ),
                "severity": "high",
                "status": "investigating",
                "timestamp": "2026-08-24T14:31:00Z",
            },
            {
                "id": "EVT-003",
                "type": "Credential Issued",
                "description": (
                    "Verifiable institutional credential issued"
                ),
                "severity": "low",
                "status": "completed",
                "timestamp": "2026-08-24T14:18:00Z",
            },
            {
                "id": "EVT-004",
                "type": "Compliance Review",
                "description": (
                    "Governance policy review completed"
                ),
                "severity": "medium",
                "status": "completed",
                "timestamp": "2026-08-24T13:55:00Z",
            },
        ]
    }


@router.get("/trust-pipeline")
def trust_pipeline(
    db: Session = Depends(get_db),
):
    return {
        "pipeline": [
            {
                "stage": "Identity",
                "value": 1248,
                "status": "active",
            },
            {
                "stage": "Verification",
                "value": 936,
                "status": "active",
            },
            {
                "stage": "Risk Assessment",
                "value": 812,
                "status": "active",
            },
            {
                "stage": "Governance",
                "value": 734,
                "status": "active",
            },
            {
                "stage": "Accountability",
                "value": 681,
                "status": "active",
            },
        ]
    }