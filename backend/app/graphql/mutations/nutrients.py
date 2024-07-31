from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError
from app.graphql.context import Info


async def create_nutrient(
    info: Info, input: "schemas.CreateNutrientInput"
) -> "schemas.Nutrient":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        nutrient = models.Nutrient(
            organization_id=info.context.user.org_id,
            nutrient_category_id=(
                int(input.nutrient_category_id.node_id)
                if input.nutrient_category_id is not None
                else None
            ),
            name=input.name,
            description=input.description,
        )
        db.add(nutrient)
        await db.commit()

        return schemas.Nutrient.from_model(nutrient, None)


async def update_nutrient(
    info: Info, input: "schemas.UpdateNutrientInput"
) -> "schemas.Nutrient":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        nutrient = await db.get(models.Nutrient, int(input.id.node_id))
        nutrient_override = None

        if nutrient is None:
            raise Exception("Nutrient not found")

        if (
            nutrient.organization_id is not None
            and nutrient.organization_id != info.context.user.org_id
        ):
            raise Exception("Nutrient not found")

        if nutrient.managed:
            # update or create override profile
            if utils.is_set(input.nutrient_category_id):
                raise Exception("Cannot change nutrient category of managed nutrient")

            nutrient_override = await db.get(
                models.ManagedNutrientOverride,
                (info.context.user.org_id, nutrient.id),
            )

            if nutrient_override is None:
                nutrient_override = models.ManagedNutrientOverride(
                    organization_id=info.context.user.org_id,
                    nutrient_id=nutrient.id,
                    name=input.name if utils.is_set(input.name) else None,
                    description=(
                        input.description if utils.is_set(input.description) else None
                    ),
                )
                db.add(nutrient_override)
            else:
                if utils.is_set(input.name):
                    nutrient_override.name = input.name
                if utils.is_set(input.description):
                    nutrient_override.description = input.description
        else:
            if utils.is_value(input.name):
                nutrient.name = input.name
            if utils.is_set(input.description):
                nutrient.description = input.description
            if utils.is_set(input.nutrient_category_id):
                if input.nutrient_category_id is None:
                    nutrient.nutrient_category_id = None
                else:
                    nutrient_category = await db.get(
                        models.NutrientCategory, int(input.nutrient_category_id.node_id)
                    )

                    if nutrient_category is None:
                        raise Exception("Nutrient category not found")

                    if (
                        nutrient_category.organization_id is not None
                        and nutrient_category.organization_id
                        != info.context.user.org_id
                    ):
                        raise Exception("Nutrient category not found")

                    nutrient.nutrient_category_id = int(
                        input.nutrient_category_id.node_id
                    )

        await db.commit()

        return schemas.Nutrient.from_model(nutrient, nutrient_override)


async def delete_nutrient(
    info: Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            nutrient = await db.get(models.Nutrient, int(id.node_id))

            if nutrient is None:
                raise Exception("Nutrient not found")

            if (
                nutrient.organization_id is not None
                and nutrient.organization_id != info.context.user.org_id
            ):
                raise Exception("Nutrient not found")

            if nutrient.managed:
                raise Exception("Cannot delete managed nutrient")

            nutrient.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)
