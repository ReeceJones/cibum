import asyncio

from app.config import CONFIG
from sqlalchemy.pool import NullPool, AsyncAdaptedQueuePool

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, async_scoped_session


POOL_CLASS = NullPool if CONFIG.TESTING else AsyncAdaptedQueuePool


class DB:
    engine = create_async_engine(CONFIG.DB_URI, poolclass=POOL_CLASS, echo=CONFIG.ECHO_SQL, future=True)
    session_maker = async_sessionmaker(
        bind=engine, autoflush=False, expire_on_commit=False
    )
    async_session = async_scoped_session(session_maker, scopefunc=asyncio.current_task)