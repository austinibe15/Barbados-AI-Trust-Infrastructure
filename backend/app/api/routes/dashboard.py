from fastapi import APIRouter

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def dashboard_summary():
    return {
        "total_identities": 1248,
        "verified_identities": 1096,
        "active_institutions": 42,
        "trust_score": 94.7,
        "open_risks": 18,
        "critical_risks": 3,
        "compliance_rate": 96.2,
    }


@router.get("/risk-distribution")
def risk_distribution():
    return {
        "distribution": [
            {
                "level": "Low",
                "count": 812,
                "percentage": 65.1,
            },
            {
                "level": "Medium",
                "count": 318,
                "percentage": 25.5,
            },
            {
                "level": "High",
                "count": 95,
                "percentage": 7.6,
            },
            {
                "level": "Critical",
                "count": 23,
                "percentage": 1.8,
            },
        ]
    }


@router.get("/recent-events")
def recent_events():
    return {
        "events": [
            {
                "id": "EVT-001",
                "type": "Identity Verification",
                "description": "Identity successfully verified",
                "severity": "low",
                "status": "completed",
                "timestamp": "2026-08-24T14:52:00Z",
            },
            {
                "id": "EVT-002",
                "type": "Risk Detection",
                "description": "Anomalous access pattern detected",
                "severity": "high",
                "status": "investigating",
                "timestamp": "2026-08-24T14:41:00Z",
            },
            {
                "id": "EVT-003",
                "type": "Credential Issued",
                "description": "Verifiable credential issued",
                "severity": "low",
                "status": "completed",
                "timestamp": "2026-08-24T14:28:00Z",
            },
        ]
    }


@router.get("/trust-pipeline")
def trust_pipeline():
    return {
        "pipeline": [
            {
                "stage": "Identity",
                "value": 1248,
            },
            {
                "stage": "Verification",
                "value": 1096,
            },
            {
                "stage": "Risk Assessment",
                "value": 1042,
            },
            {
                "stage": "Compliance",
                "value": 1008,
            },
            {
                "stage": "Accountability",
                "value": 987,
            },
        ]
    }