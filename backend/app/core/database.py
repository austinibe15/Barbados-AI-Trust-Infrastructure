import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker


load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not configured")


# ---------------------------------------------------------
# DATABASE SSL CONFIGURATION
# ---------------------------------------------------------

connect_args = {}

DB_SSL_CA = os.getenv("DB_SSL_CA")

if DB_SSL_CA:
    connect_args["ssl"] = {
        "ca": DB_SSL_CA,
        "check_hostname": True,
    }


# ---------------------------------------------------------
# DATABASE ENGINE
# ---------------------------------------------------------

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=False,
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


Base = declarative_base()


# ---------------------------------------------------------
# DATABASE DEPENDENCY
# ---------------------------------------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------
# DATABASE CONNECTION CHECK
# ---------------------------------------------------------

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