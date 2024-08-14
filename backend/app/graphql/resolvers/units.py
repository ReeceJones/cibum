from typing import Iterable, Optional

from sqlalchemy import select

from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError


async def get_units(info: "context.Info") -> list["schemas.Unit"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        units = await db.scalars(
            select(models.Unit)
            .where(
                models.Unit.archived == False,
            )
            .order_by(models.Unit.id.asc())
        )

        return [schemas.Unit.from_model(unit) for unit in units]


async def resolve_unit_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.Unit"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in node_ids]
    async with DB.async_session() as db:
        units = await db.scalars(
            select(models.Unit).where(
                models.Unit.id.in_(nodes),
                models.Unit.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes, units, required, lambda x: x.id, schemas.Unit.from_model
        )
