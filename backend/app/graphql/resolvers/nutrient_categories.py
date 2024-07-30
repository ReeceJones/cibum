from typing import Iterable, Optional

from sqlalchemy import or_, select

from app import crud, models
from app.db import DB
from app.graphql import context, schemas
from app.graphql.access import AuthError


async def resolve_nutrient_category_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.NutrientCategory"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in node_ids]
    async with DB.async_session() as db:
        nutrient_categories = await db.scalars(
            select(models.NutrientCategory).where(
                or_(
                    models.NutrientCategory.organization_id == None,
                    models.NutrientCategory.organization_id == info.context.user.org_id,
                ),
                models.NutrientCategory.id.in_(nodes),
                models.NutrientCategory.archived == False,
            )
        )

        nutrient_category_overrides = await db.scalars(
            select(models.ManagedNutrientCategoryOverride).where(
                models.ManagedNutrientCategoryOverride.organization_id
                == info.context.user.org_id,
                models.ManagedNutrientCategoryOverride.nutrient_category_id.in_(nodes),
                models.ManagedNutrientCategoryOverride.archived == False,
            )
        )

        nutrient_categories_dict: dict[int, models.NutrientCategory] = {
            x.id: x for x in nutrient_categories
        }
        nutrient_category_overrides_dict: dict[
            int, models.ManagedNutrientCategoryOverride
        ] = {x.nutrient_category_id: x for x in nutrient_category_overrides}

        results: list[Optional["schemas.NutrientCategory"]] = []

        for node in nodes:
            if (nutrient_category := nutrient_categories_dict.get(node)) is not None:
                override = nutrient_category_overrides_dict.get(node)
                results.append(
                    schemas.NutrientCategory.from_model(
                        nutrient_category,
                        override,
                    )
                )
            else:
                if required:
                    raise Exception(f"Model with ID {node} not found")
                results.append(None)

        return results


async def get_nutrient_categories(
    info: "context.Info",
) -> list["schemas.NutrientCategory"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        nutrient_categories = await db.scalars(
            select(models.NutrientCategory)
            .where(
                or_(
                    models.NutrientCategory.organization_id == None,
                    models.NutrientCategory.organization_id == info.context.user.org_id,
                ),
                models.NutrientCategory.archived == False,
            )
            .order_by(models.NutrientCategory.name.asc())
        )

        nutrient_category_overrides = await db.scalars(
            select(models.ManagedNutrientCategoryOverride).where(
                models.ManagedNutrientCategoryOverride.organization_id
                == info.context.user.org_id,
                models.ManagedNutrientCategoryOverride.archived == False,
            )
        )

        nutrient_category_overrides_dict: dict[
            int, models.ManagedNutrientCategoryOverride
        ] = {x.nutrient_category_id: x for x in nutrient_category_overrides}

        results: list["schemas.NutrientCategory"] = []

        for nutrient_category in nutrient_categories:
            override = nutrient_category_overrides_dict.get(nutrient_category.id)
            results.append(
                schemas.NutrientCategory.from_model(
                    nutrient_category,
                    override,
                )
            )

        return results


async def resolve_child_nutrient_categories(
    id: int,
    info: "context.Info",
) -> list["schemas.NutrientCategory"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        categories = await crud.get_child_nutrient_categories_with_overrides(
            db, id, info.context.user.org_id
        )
        return [
            schemas.NutrientCategory.from_model(category, override)
            for category, override in categories
        ]
