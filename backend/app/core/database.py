import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker


load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")


if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not configured")


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False,
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# Temporary database diagnostic
def check_database():
    try:
        with engine.connect() as connection:
            database = connection.execute(
                text("SELECT DATABASE()")
            ).fetchone()

            print(
                "BATI ACTIVE DATABASE:",
                database
            )

    except Exception as error:
        print(
            "DATABASE CHECK ERROR:",
            error
        )