from typing import Iterable, Optional

from sqlalchemy import or_, select

from app import crud, models
from app.db import DB
from app.graphql import context, schemas
from app.graphql.access import AuthError


async def resolve_ingredient_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.Ingredient"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in node_ids]
    async with DB.async_session() as db:
        ingredients = await db.scalars(
            select(models.Ingredient).where(
                or_(
                    models.Ingredient.organization_id == None,
                    models.Ingredient.organization_id == info.context.user.org_id,
                ),
                models.Ingredient.id.in_(nodes),
                models.Ingredient.archived == False,
            )
        )

        ingredient_overrides = await db.scalars(
            select(models.ManagedIngredientOverride).where(
                models.ManagedIngredientOverride.organization_id
                == info.context.user.org_id,
                models.ManagedIngredientOverride.ingredient_id.in_(nodes),
                models.ManagedIngredientOverride.archived == False,
            )
        )

        ingredients_dict: dict[int, models.Ingredient] = {x.id: x for x in ingredients}
        ingredient_overrides_dict: dict[int, models.ManagedIngredientOverride] = {
            x.ingredient_id: x for x in ingredient_overrides
        }

        results: list[Optional["schemas.Ingredient"]] = []

        for node in nodes:
            if (ingredient := ingredients_dict.get(node)) is not None:
                override = ingredient_overrides_dict.get(node)
                results.append(
                    schemas.Ingredient.from_model(
                        ingredient,
                        override,
                    )
                )
            else:
                if required:
                    raise Exception(f"Model with ID {node} not found")
                results.append(None)
    return results


async def get_ingredients(info: "context.Info") -> list["schemas.Ingredient"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        ingredients = await db.scalars(
            select(models.Ingredient)
            .where(
                or_(
                    models.Ingredient.organization_id == None,
                    models.Ingredient.organization_id == info.context.user.org_id,
                ),
                models.Ingredient.archived == False,
            )
            .order_by(models.Ingredient.name.asc())
        )

        ingredient_overrides = await db.scalars(
            select(models.ManagedIngredientOverride).where(
                models.ManagedIngredientOverride.organization_id
                == info.context.user.org_id,
                models.ManagedIngredientOverride.archived == False,
            )
        )

        ingredients_overrides_dict: dict[int, models.ManagedIngredientOverride] = {
            x.ingredient_id: x for x in ingredient_overrides
        }

        results: list["schemas.Ingredient"] = []

        for ingredient in ingredients:
            override = ingredients_overrides_dict.get(ingredient.id)
            results.append(
                schemas.Ingredient.from_model(
                    ingredient,
                    override,
                )
            )

        return results


async def resolve_child_ingredients(
    info: "context.Info",
    id: int,
) -> list["schemas.Ingredient"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        ingredients = await crud.get_child_ingredients_with_overrides(
            db, id, info.context.user.org_id
        )

        return [
            schemas.Ingredient.from_model(ingredient, override)
            for ingredient, override in ingredients
        ]
