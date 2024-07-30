from app import models
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

AuthMissing = Exception("Missing authorization")
AuthError = Exception("Operation unauthorized")


async def check_access(session: AsyncSession, organization_id: int, user_id: str) -> None:
    stmt = (
        select(func.count(models.OrganizationMembership.organization_id))
        .where(
            models.OrganizationMembership.organization_id == organization_id,
            models.OrganizationMembership.user_id == user_id,
        )
    )

    count = await session.scalar(stmt)

    if count == 0:
        raise AuthError
