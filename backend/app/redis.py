import redis.asyncio as redis

from app.config import CONFIG
from contextlib import asynccontextmanager
from typing import AsyncGenerator


class REDIS:
    POOL = redis.ConnectionPool.from_url(CONFIG.REDIS_URI)

    @classmethod
    @asynccontextmanager
    async def get_connection(cls) -> AsyncGenerator[redis.Redis, None]:
        conn = None
        try:
            conn = redis.Redis(connection_pool=cls.POOL)
            yield conn
        finally:
            if conn is None:
                return
            await conn.aclose()