from sqlalchemy.orm import Session

from app.models.research_model import ResearchModel


def get_research_models(
    db: Session,
) -> list[ResearchModel]:
    return (
        db.query(ResearchModel)
        .order_by(ResearchModel.created_at.desc())
        .all()
    )


def get_research_model(
    db: Session,
    model_id: int,
) -> ResearchModel | None:
    return (
        db.query(ResearchModel)
        .filter(ResearchModel.id == model_id)
        .first()
    )


def create_research_model(
    db: Session,
    model: ResearchModel,
) -> ResearchModel:
    db.add(model)
    db.commit()
    db.refresh(model)

    return model