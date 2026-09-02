from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Identity(Base):
    __tablename__ = "identities"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    # BATI public identity reference
    # Example: BATI-ID-0001
    identity_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    # Individual or institutional identity
    # Example: institutional
    identity_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    institution: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    role: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    trust_level: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    biometric_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )