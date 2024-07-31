from typing import Iterable, Optional

from sqlalchemy import or_, select

from app import crud, models
from app.db import DB
from app.graphql import context, schemas
from app.graphql.access import AuthError


async def resolve_ingredient_category_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.IngredientCategory"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in node_ids]
    async with DB.async_session() as db:
        ingredient_categories = await db.scalars(
            select(models.IngredientCategory).where(
                or_(
                    models.IngredientCategory.organization_id == None,
                    models.IngredientCategory.organization_id
                    == info.context.user.org_id,
                ),
                models.IngredientCategory.id.in_(nodes),
                models.IngredientCategory.archived == False,
            )
        )

        ingredient_category_overrides = await db.scalars(
            select(models.ManagedIngredientCategoryOverride).where(
                models.ManagedIngredientCategoryOverride.organization_id
                == info.context.user.org_id,
                models.ManagedIngredientCategoryOverride.ingredient_category_id.in_(
                    nodes
                ),
                models.ManagedIngredientCategoryOverride.archived == False,
            )
        )

        ingredient_categories_dict: dict[int, models.IngredientCategory] = {
            x.id: x for x in ingredient_categories
        }
        ingredient_category_overrides_dict: dict[
            int, models.ManagedIngredientCategoryOverride
        ] = {x.ingredient_category_id: x for x in ingredient_category_overrides}

        results: list[Optional["schemas.IngredientCategory"]] = []

        for node in nodes:
            if (
                ingredient_category := ingredient_categories_dict.get(node)
            ) is not None:
                override = ingredient_category_overrides_dict.get(node)
                results.append(
                    schemas.IngredientCategory.from_model(
                        ingredient_category,
                        override,
                    )
                )
            else:
                if required:
                    raise Exception(f"Model with ID {node} not found")
                results.append(None)

        return results


async def get_ingredient_categories(
    info: context.Info, required: bool = False
) -> list["schemas.IngredientCategory"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        ingredient_categories = await db.scalars(
            select(models.IngredientCategory).where(
                or_(
                    models.IngredientCategory.organization_id == None,
                    models.IngredientCategory.organization_id
                    == info.context.user.org_id,
                ),
                models.IngredientCategory.archived == False,
            )
        )

        ingredient_category_overrides = await db.scalars(
            select(models.ManagedIngredientCategoryOverride).where(
                models.ManagedIngredientCategoryOverride.organization_id
                == info.context.user.org_id,
                models.ManagedIngredientCategoryOverride.archived == False,
            )
        )

        ingredient_category_overrides_dict: dict[
            int, models.ManagedIngredientCategoryOverride
        ] = {x.ingredient_category_id: x for x in ingredient_category_overrides}

        results: list["schemas.IngredientCategory"] = []

        for ingredient_category in ingredient_categories:
            override = ingredient_category_overrides_dict.get(ingredient_category.id)
            results.append(
                schemas.IngredientCategory.from_model(
                    ingredient_category,
                    override,
                )
            )

        return results


async def resolve_child_ingredient_categories(
    info: context.Info, id: int
) -> list["schemas.IngredientCategory"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        categories = await crud.get_child_ingredient_categories_with_overrides(
            db, id, info.context.user.org_id
        )
        return [
            schemas.IngredientCategory.from_model(category, override)
            for category, override in categories
        ]
