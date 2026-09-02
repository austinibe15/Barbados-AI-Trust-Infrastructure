from datetime import datetime

from sqlalchemy import DateTime, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class RiskEvent(Base):
    __tablename__ = "risk_events"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    event_reference: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    event_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    risk_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    risk_classification: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    explanation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="open",
        nullable=False,
        index=True,
    )

    detected_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )