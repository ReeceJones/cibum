from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError


async def create_ingredient_category(
    info: context.Info, input: "schemas.CreateIngredientCategoryInput"
) -> "schemas.IngredientCategory":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        ingredient_category = models.IngredientCategory(
            organization_id=info.context.user.org_id,
            name=input.name,
            description=input.description,
            parent_ingredient_category_id=(
                int(input.parent_ingredient_category_id.node_id)
                if input.parent_ingredient_category_id is not None
                else None
            ),
        )
        db.add(ingredient_category)
        await db.commit()

        return schemas.IngredientCategory.from_model(ingredient_category, None)


async def update_ingredient_category(
    info: context.Info, input: "schemas.UpdateIngredientCategoryInput"
) -> "schemas.IngredientCategory":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        ingredient_category = await db.get(
            models.IngredientCategory, int(input.id.node_id)
        )
        ingredient_category_override = None

        if ingredient_category is None:
            raise Exception("Ingredient category not found")

        if (
            ingredient_category.organization_id is not None
            and ingredient_category.organization_id != info.context.user.org_id
        ):
            raise Exception("Ingredient category not found")

        if ingredient_category.managed:
            # update or create override profile
            if utils.is_set(input.parent_ingredient_category_id):
                raise Exception("Cannot change parent of managed ingredient category")

            ingredient_category_override = await db.get(
                models.ManagedIngredientCategoryOverride,
                (info.context.user.org_id, ingredient_category.id),
            )

            if ingredient_category_override is None:
                ingredient_category_override = models.ManagedIngredientCategoryOverride(
                    organization_id=info.context.user.org_id,
                    ingredient_category_id=ingredient_category.id,
                    name=input.name,
                    description=input.description,
                )
                db.add(ingredient_category_override)
            else:
                if utils.is_set(input.name):
                    ingredient_category_override.name = input.name
                if utils.is_set(input.description):
                    ingredient_category_override.description = input.description
        else:
            if utils.is_value(input.name):
                ingredient_category.name = input.name
            if utils.is_set(input.description):
                ingredient_category.description = input.description
            if utils.is_set(input.parent_ingredient_category_id):
                if input.parent_ingredient_category_id is None:
                    ingredient_category.parent_ingredient_category_id = None
                else:
                    parent_ingredient_category = await db.get(
                        models.IngredientCategory,
                        int(input.parent_ingredient_category_id.node_id),
                    )

                    if parent_ingredient_category is None:
                        raise Exception("Parent ingredient category not found")

                    if (
                        parent_ingredient_category.organization_id is not None
                        and parent_ingredient_category.organization_id
                        != info.context.user.org_id
                    ):
                        raise Exception("Parent ingredient category not found")

                    ingredient_category.parent_ingredient_category_id = (
                        parent_ingredient_category.id
                    )

        await db.commit()
        return schemas.IngredientCategory.from_model(
            ingredient_category, ingredient_category_override
        )


async def delete_ingredient_category(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            ingredient_category = await db.get(
                models.IngredientCategory, int(id.node_id)
            )

            if ingredient_category is None:
                raise Exception("Ingredient category not found")

            if (
                ingredient_category.organization_id is not None
                and ingredient_category.organization_id != info.context.user.org_id
            ):
                raise Exception("Ingredient category not found")

            if ingredient_category.managed:
                raise Exception("Cannot delete managed ingredient category")

            children = [ingredient_category]
            while len(children) > 0:
                child = children.pop()
                db.expire(child, ["child_ingredient_categories", "ingredients"])
                await db.refresh(child)
                children.extend(child.child_ingredient_categories)
                child.archived = True
                for ingredient in child.ingredients:
                    ingredient.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)
