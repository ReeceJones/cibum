from sqlalchemy import update

from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError


def _build_nutrient_category_model(
    input: "schemas.NutrientCategorySettingsInput",
    organization_id: str,
    parent: models.NutrientCategory | None = None,
) -> models.NutrientCategory:
    nutrient_category = models.NutrientCategory(organization_id=organization_id)
    if utils.is_value(input.id):
        nutrient_category.id = int(input.id.node_id)
    if utils.is_value(input.name):
        nutrient_category.name = input.name
    if utils.is_set(input.description):
        nutrient_category.description = input.description
    if utils.is_value(input.parent_nutrient_category_id):
        nutrient_category.parent_nutrient_category_id = int(
            input.parent_nutrient_category_id.node_id
        )
    if parent is not None:
        nutrient_category.parent_nutrient_category = parent

    if utils.is_value(input.child_categories):
        for child_category in input.child_categories:
            _build_nutrient_category_model(
                child_category, organization_id, nutrient_category
            )
    if utils.is_value(input.child_nutrients):
        for child_nutrient in input.child_nutrients:
            nutrient = models.Nutrient(nutrient_category_id=nutrient_category.id)
            if utils.is_value(child_nutrient.id):
                nutrient.id = int(child_nutrient.id.node_id)
            if utils.is_value(child_nutrient.name):
                nutrient.name = child_nutrient.name
            if utils.is_set(child_nutrient.description):
                nutrient.description = child_nutrient.description
            nutrient.nutrient_category = nutrient_category

    return nutrient_category


async def update_nutrient_settings(
    info: context.Info, input: "schemas.UpdateNutrientSettingsInput"
) -> "schemas.UpdatedNutrientSettings":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        # delete nutrients
        if utils.is_value(input.delete_nutrients):
            delete_nutrient_ids = [int(x.node_id) for x in input.delete_nutrients.ids]
            await db.execute(
                update(models.Nutrient)
                .where(
                    models.Nutrient.organization_id == info.context.user.org_id,
                    models.Nutrient.id.in_(delete_nutrient_ids),
                )
                .values(archived=True)
            )
            await db.flush()

        # delete nutrient categories
        if utils.is_value(input.delete_nutrient_categories):
            delete_nutrient_category_ids = [
                int(x.node_id) for x in input.delete_nutrient_categories.ids
            ]
            await db.execute(
                update(models.NutrientCategory)
                .where(
                    models.NutrientCategory.organization_id == info.context.user.org_id,
                    models.NutrientCategory.id.in_(delete_nutrient_category_ids),
                )
                .values(archived=True)
            )
            await db.flush()

        # update root-level nutrients
        if utils.is_value(input.update_nutrients):
            for update_nutrient in input.update_nutrients:
                nutrient = models.Nutrient(nutrient_category_id=None)
                if utils.is_value(update_nutrient.id):
                    nutrient.id = int(update_nutrient.id.node_id)
                if utils.is_value(update_nutrient.name):
                    nutrient.name = update_nutrient.name
                if utils.is_set(update_nutrient.description):
                    nutrient.description = update_nutrient.description
                await db.merge(nutrient)
            await db.flush()

        # update nutrient categories and their children
        if utils.is_value(input.update_nutrient_categories):
            for update_nutrient_category in input.update_nutrient_categories:
                nutrient_category = _build_nutrient_category_model(
                    update_nutrient_category, info.context.user.org_id
                )
                await db.merge(nutrient_category)
            await db.flush()

    return schemas.UpdatedNutrientSettings(success=True)
