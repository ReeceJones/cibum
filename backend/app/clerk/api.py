from app.redis import REDIS
from app.config import CONFIG
import json
import httpx
from typing import Any

CLERK_BASE = "https://api.clerk.com/v1"

def get_clerk_headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {CONFIG.CLERK_SECRET_KEY}",
    }

async def get_cached_object(key: str) -> Any | None:
    async with REDIS.get_connection() as conn:
        cached_object = await conn.get(key)
        if cached_object is not None:
            return json.loads(cached_object)
    return None

async def cache_object(key: str, obj: Any, *, ex: int = 60*60*24*7) -> None:
    async with REDIS.get_connection() as conn:
        await conn.set(key, json.dumps(obj), ex=ex)


async def get_user(user_id: str, *, cache: bool = True) -> dict[str, Any]:
    if cache:
        cached_object = await get_cached_object(f'clerk:user:{user_id}')
        if cached_object is not None:
            return cached_object

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{CLERK_BASE}/users/{user_id}", headers=get_clerk_headers())
        response.raise_for_status()
        clerk_information = response.json()
        if cache:
            await cache_object(f'clerk:user:{user_id}', clerk_information)
        return clerk_information

async def get_organization(org_id: str, *, cache: bool = True) -> dict[str, Any]:
    if cache:
        cached_object = await get_cached_object(f'clerk:organization:{org_id}')
        if cached_object is not None:
            return cached_object

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{CLERK_BASE}/organizations/{org_id}", headers=get_clerk_headers())
        response.raise_for_status()
        clerk_information = response.json()
        if cache:
            await cache_object(f'clerk:organization:{org_id}', clerk_information)
        return clerk_information
