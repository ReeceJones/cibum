from typing import Iterable, Optional

from sqlalchemy import or_, select

from app import crud, models
from app.db import DB
from app.graphql import context, schemas
from app.graphql.access import AuthError


async def resolve_nutrient_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.Nutrient"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in node_ids]
    async with DB.async_session() as db:
        nutrients = await db.scalars(
            select(models.Nutrient).where(
                or_(
                    models.Nutrient.organization_id == None,
                    models.Nutrient.organization_id == info.context.user.org_id,
                ),
                models.Nutrient.id.in_(nodes),
                models.Nutrient.archived == False,
            )
        )

        nutrient_overrides = await db.scalars(
            select(models.ManagedNutrientOverride).where(
                models.ManagedNutrientOverride.organization_id
                == info.context.user.org_id,
                models.ManagedNutrientOverride.nutrient_id.in_(nodes),
                models.ManagedNutrientOverride.archived == False,
            )
        )

        # cannot use _make_relay_result here because of the different types

        nutrients_dict: dict[int, models.Nutrient] = {x.id: x for x in nutrients}
        nutrient_overrides_dict: dict[int, models.ManagedNutrientOverride] = {
            x.nutrient_id: x for x in nutrient_overrides
        }

        results: list[Optional["schemas.Nutrient"]] = []

        for node in nodes:
            if (nutrient := nutrients_dict.get(node)) is not None:
                override = nutrient_overrides_dict.get(node)
                results.append(
                    schemas.Nutrient.from_model(
                        nutrient,
                        override,
                    )
                )
            else:
                if required:
                    raise Exception(f"Model with ID {node} not found")
                results.append(None)

        return results


async def get_nutrients(
    info: "context.Info",
) -> list["schemas.Nutrient"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        nutrients = await db.scalars(
            select(models.Nutrient)
            .where(
                or_(
                    models.Nutrient.organization_id == None,
                    models.Nutrient.organization_id == info.context.user.org_id,
                ),
                models.Nutrient.archived == False,
            )
            .order_by(models.Nutrient.name.asc())
        )

        nutrient_overrides = await db.scalars(
            select(models.ManagedNutrientOverride).where(
                models.ManagedNutrientOverride.organization_id
                == info.context.user.org_id,
                models.ManagedNutrientOverride.archived == False,
            )
        )

        nutrient_overrides_dict: dict[int, models.ManagedNutrientOverride] = {
            x.nutrient_id: x for x in nutrient_overrides
        }

        results: list["schemas.Nutrient"] = []

        for nutrient in nutrients:
            override = nutrient_overrides_dict.get(nutrient.id)
            results.append(
                schemas.Nutrient.from_model(
                    nutrient,
                    override,
                )
            )

        return results


async def resolve_child_nutrients(
    info: "context.Info",
    id: int,
) -> list["schemas.Nutrient"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        nutrients = await crud.get_child_nutrients_with_overrides(
            db, id, info.context.user.org_id
        )
        return [
            schemas.Nutrient.from_model(nutrient, override)
            for nutrient, override in nutrients
        ]
