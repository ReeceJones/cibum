from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError
from app.graphql.context import Info


async def create_ingredient(
    info: Info, input: "schemas.CreateIngredientInput"
) -> "schemas.Ingredient":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        ingredient = models.Ingredient(
            organization_id=info.context.user.org_id,
            ingredient_category_id=(
                int(input.ingredient_category_id.node_id)
                if input.ingredient_category_id is not None
                else None
            ),
            name=input.name,
            description=input.description,
        )
        db.add(ingredient)
        await db.commit()

        return schemas.Ingredient.from_model(ingredient, None)


async def update_ingredient(
    info: Info, input: "schemas.UpdateIngredientInput"
) -> "schemas.Ingredient":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        ingredient = await db.get(models.Ingredient, int(input.id.node_id))
        ingredient_override = None

        if ingredient is None:
            raise Exception("Ingredient not found")

        if (
            ingredient.organization_id is not None
            and ingredient.organization_id != info.context.user.org_id
        ):
            raise Exception("Ingredient not found")

        if ingredient.managed:
            # update or create override profile
            if utils.is_set(input.ingredient_category_id):
                raise Exception(
                    "Cannot change ingredient category of managed ingredient"
                )

            ingredient_override = await db.get(
                models.ManagedIngredientOverride,
                (info.context.user.org_id, ingredient.id),
            )

            if ingredient_override is None:
                ingredient_override = models.ManagedIngredientOverride(
                    organization_id=info.context.user.org_id,
                    ingredient_id=ingredient.id,
                    name=ingredient.name,
                    description=ingredient.description,
                )
                db.add(ingredient_override)
            else:
                if utils.is_set(input.name):
                    ingredient_override.name = input.name
                if utils.is_set(input.description):
                    ingredient_override.description = input.description
        else:
            if utils.is_value(input.name):
                ingredient.name = input.name
            if utils.is_set(input.description):
                ingredient.description = input.description
            if utils.is_set(input.ingredient_category_id):
                if input.ingredient_category_id is None:
                    ingredient.ingredient_category_id = None
                else:
                    ingredient_category = await db.get(
                        models.IngredientCategory,
                        int(input.ingredient_category_id.node_id),
                    )

                    if ingredient_category is None:
                        raise Exception("Ingredient category not found")

                    if (
                        ingredient_category.organization_id is not None
                        and ingredient_category.organization_id
                        != info.context.user.org_id
                    ):
                        raise Exception("Ingredient category not found")

                    ingredient.ingredient_category_id = int(
                        input.ingredient_category_id.node_id
                    )

        await db.commit()

        return schemas.Ingredient.from_model(ingredient, ingredient_override)


async def delete_ingredient(
    info: Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            ingredient = await db.get(models.Ingredient, int(id.node_id))

            if ingredient is None:
                raise Exception("Ingredient not found")

            if (
                ingredient.organization_id is not None
                and ingredient.organization_id != info.context.user.org_id
            ):
                raise Exception("Ingredient not found")

            if ingredient.managed:
                raise Exception("Cannot delete managed ingredient")

            ingredient.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)
