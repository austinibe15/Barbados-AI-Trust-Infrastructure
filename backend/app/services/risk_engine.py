from dataclasses import dataclass


@dataclass
class RiskAssessment:
    score: float
    classification: str
    explanation: str


def classify_risk(score: float) -> str:
    """
    Convert a 0–100 risk score into a BATI risk classification.
    """

    if score < 25:
        return "low"

    if score < 50:
        return "medium"

    if score < 75:
        return "high"

    return "critical"


def assess_credential_event(
    *,
    event_type: str,
    credential_status: str | None = None,
    was_previously_verified: bool = False,
) -> RiskAssessment:
    """
    Deterministic BATI credential risk engine.

    This is intentionally explainable and rule-based for the
    research prototype. It can later be replaced or augmented
    with an ML/anomaly-detection model.
    """

    event_type = event_type.upper()

    # -----------------------------------------------------
    # Credential revoked
    # -----------------------------------------------------

    if event_type == "CREDENTIAL_REVOCATION":
        if was_previously_verified:
            score = 75.0

            explanation = (
                "Credential was revoked after previously being verified."
            )
        else:
            score = 60.0

            explanation = (
                "Credential was revoked before a successful verification."
            )

        return RiskAssessment(
            score=score,
            classification=classify_risk(score),
            explanation=explanation,
        )

    # -----------------------------------------------------
    # Revoked credential verification attempt
    # -----------------------------------------------------

    if event_type == "CREDENTIAL_VERIFICATION":

        if credential_status == "revoked":
            score = 90.0

            explanation = (
                "Verification was attempted on a revoked credential."
            )

            return RiskAssessment(
                score=score,
                classification=classify_risk(score),
                explanation=explanation,
            )

        # -------------------------------------------------
        # Expired credential
        # -------------------------------------------------

        if credential_status == "expired":
            score = 80.0

            explanation = (
                "Verification was attempted on an expired credential."
            )

            return RiskAssessment(
                score=score,
                classification=classify_risk(score),
                explanation=explanation,
            )

        # -------------------------------------------------
        # Normal verification
        # -------------------------------------------------

        score = 5.0

        explanation = (
            "Credential verification completed without a detected "
            "risk condition."
        )

        return RiskAssessment(
            score=score,
            classification=classify_risk(score),
            explanation=explanation,
        )

    # -----------------------------------------------------
    # Credential creation
    # -----------------------------------------------------

    if event_type == "CREDENTIAL_CREATED":
        score = 10.0

        explanation = (
            "Credential was created through the BATI credential "
            "issuance workflow."
        )

        return RiskAssessment(
            score=score,
            classification=classify_risk(score),
            explanation=explanation,
        )

    # -----------------------------------------------------
    # Unknown event
    # -----------------------------------------------------

    score = 30.0

    explanation = (
        f"Unclassified event '{event_type}' requires further "
        "risk assessment."
    )

    return RiskAssessment(
        score=score,
        classification=classify_risk(score),
        explanation=explanation,
    )