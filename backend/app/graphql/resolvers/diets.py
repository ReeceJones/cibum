from typing import Iterable, Optional

from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError
from sqlalchemy import func, select


async def get_diets(info: "context.Info") -> list["schemas.Diet"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diets = await db.scalars(
            select(models.Diet)
            .where(
                models.Diet.organization_id == info.context.user.org_id,
                models.Diet.archived == False,
            )
            .order_by(models.Diet.updated_at.desc())
        )

        return [schemas.Diet.from_model(diet) for diet in diets]


async def resolve_diet_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.Diet"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in node_ids]
    async with DB.async_session() as db:
        diets = await db.scalars(
            select(models.Diet).where(
                models.Diet.organization_id == info.context.user.org_id,
                models.Diet.id.in_(nodes),
                models.Diet.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes, diets, required, lambda x: x.id, schemas.Diet.from_model
        )


async def resolve_latest_diet_configuration_version(
    info: "context.Info", diet_id: int
) -> Optional["schemas.DietConfigurationVersion"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diet = await db.scalar(
            select(models.DietConfigurationVersion).where(
                models.DietConfigurationVersion.diet_id == diet_id,
                models.DietConfigurationVersion.version
                == (
                    select(func.max(models.DietConfigurationVersion.version)).where(
                        models.DietConfigurationVersion.diet_id == diet_id
                    )
                ),
            )
        )

    if diet is None:
        return None

    return schemas.DietConfigurationVersion.from_model(diet)


async def resolve_latest_diet_output_version(
    info: "context.Info", diet_id: int
) -> Optional["schemas.DietOutputVersion"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diet = await db.scalar(
            select(models.DietOutputVersion).where(
                models.DietOutputVersion.diet_id == diet_id,
                models.DietOutputVersion.version
                == (
                    select(func.max(models.DietOutputVersion.version)).where(
                        models.DietOutputVersion.diet_id == diet_id
                    )
                ),
            )
        )

    if diet is None:
        return None

    return schemas.DietOutputVersion.from_model(diet)


async def resolve_diet_configuration_version_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.DietConfigurationVersion"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [schemas.DietConfigurationVersion.parse_node_id(x) for x in node_ids]
    diet_ids = set(x[0] for x in nodes)
    versions = set(x[1] for x in nodes)
    async with DB.async_session() as db:
        versions = await db.scalars(
            select(models.DietConfigurationVersion).where(
                models.DietConfigurationVersion.diet_id.in_(diet_ids),
                models.DietConfigurationVersion.version.in_(versions),
            )
        )

        return utils.make_relay_result(
            nodes,
            versions,
            required,
            schemas.DietConfigurationVersion.make_node_id,
            schemas.DietConfigurationVersion.from_model,
        )


async def resolve_diet_output_version_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.DietOutputVersion"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [schemas.DietOutputVersion.parse_node_id(x) for x in node_ids]
    diet_ids = set(x[0] for x in nodes)
    versions = set(x[1] for x in nodes)
    async with DB.async_session() as db:
        versions = await db.scalars(
            select(models.DietOutputVersion).where(
                models.DietOutputVersion.diet_id.in_(diet_ids),
                models.DietOutputVersion.version.in_(versions),
            )
        )

        return utils.make_relay_result(
            nodes,
            versions,
            required,
            schemas.DietOutputVersion.make_node_id,
            schemas.DietOutputVersion.from_model,
        )
