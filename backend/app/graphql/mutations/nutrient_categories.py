from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError


async def create_nutrient_category(
    info: context.Info, input: "schemas.CreateNutrientCategoryInput"
) -> "schemas.NutrientCategory":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        nutrient_category = models.NutrientCategory(
            organization_id=info.context.user.org_id,
            name=input.name,
            description=input.description,
            parent_nutrient_category_id=(
                int(input.parent_nutrient_category_id.node_id)
                if input.parent_nutrient_category_id is not None
                else None
            ),
        )
        db.add(nutrient_category)
        await db.commit()

        return schemas.NutrientCategory.from_model(nutrient_category, None)


async def update_nutrient_category(
    info: context.Info, input: "schemas.UpdateNutrientCategoryInput"
) -> "schemas.NutrientCategory":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        nutrient_category = await db.get(models.NutrientCategory, int(input.id.node_id))
        nutrient_category_override = None

        if nutrient_category is None:
            raise Exception("Nutrient category not found")

        if (
            nutrient_category.organization_id is not None
            and nutrient_category.organization_id != info.context.user.org_id
        ):
            raise Exception("Nutrient category not found")

        if nutrient_category.managed:
            # update or create override profile
            if utils.is_set(input.parent_nutrient_category_id):
                raise Exception("Cannot change parent of managed nutrient category")

            nutrient_category_override = await db.get(
                models.ManagedNutrientCategoryOverride,
                (info.context.user.org_id, nutrient_category.id),
            )

            if nutrient_category_override is None:
                nutrient_category_override = models.ManagedNutrientCategoryOverride(
                    organization_id=info.context.user.org_id,
                    nutrient_category_id=nutrient_category.id,
                    name=(input.name if utils.is_set(input.name) else None),
                    description=(
                        input.description if utils.is_set(input.description) else None
                    ),
                )
                db.add(nutrient_category_override)
            else:
                if utils.is_set(input.name):
                    nutrient_category_override.name = input.name
                if utils.is_set(input.description):
                    nutrient_category_override.description = input.description
        else:
            # update in place
            if utils.is_value(input.name):
                nutrient_category.name = input.name
            if utils.is_set(input.description):
                nutrient_category.description = input.description
            if utils.is_set(input.parent_nutrient_category_id):
                if input.parent_nutrient_category_id is None:
                    nutrient_category.parent_nutrient_category_id = None
                else:
                    parent_nutrient_category = await db.get(
                        models.NutrientCategory,
                        int(input.parent_nutrient_category_id.node_id),
                    )

                    if parent_nutrient_category is None:
                        raise Exception("Parent nutrient category not found")

                    if (
                        parent_nutrient_category.organization_id is not None
                        and parent_nutrient_category.organization_id
                        != info.context.user.org_id
                    ):
                        raise Exception("Parent nutrient category not found")

                    nutrient_category.parent_nutrient_category_id = int(
                        input.parent_nutrient_category_id.node_id
                    )

        await db.commit()
        return schemas.NutrientCategory.from_model(
            nutrient_category, nutrient_category_override
        )


async def delete_nutrient_category(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            nutrient_category = await db.get(models.NutrientCategory, int(id.node_id))

            if nutrient_category is None:
                raise Exception("Nutrient category not found")

            if (
                nutrient_category.organization_id is not None
                and nutrient_category.organization_id != info.context.user.org_id
            ):
                raise Exception("Nutrient category not found")

            if nutrient_category.managed:
                raise Exception("Cannot delete managed nutrient category")

            children = [nutrient_category]
            while len(children) > 0:
                child = children.pop()
                db.expire(child, ["child_nutrient_categories", "nutrients"])
                await db.refresh(
                    child,
                    ["child_nutrient_categories", "nutrients"],
                )
                children.extend(child.child_nutrient_categories)
                child.archived = True
                for nutrient in child.nutrients:
                    nutrient.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)
