from typing import Iterable, Optional

from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError
from sqlalchemy import func, select


async def get_diets(info: "context.Info") -> list["schemas.Diet"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diets = await db.scalars(
            select(models.Diet)
            .where(
                models.Diet.organization_id == info.context.user.org_id,
                models.Diet.archived == False,
            )
            .order_by(models.Diet.updated_at.desc())
        )

        return [schemas.Diet.from_model(diet) for diet in diets]


async def resolve_diet_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.Diet"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in node_ids]
    async with DB.async_session() as db:
        diets = await db.scalars(
            select(models.Diet).where(
                models.Diet.organization_id == info.context.user.org_id,
                models.Diet.id.in_(nodes),
                models.Diet.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes, diets, required, lambda x: x.id, schemas.Diet.from_model
        )


async def resolve_latest_diet_configuration_version(
    info: "context.Info", diet_id: int
) -> Optional["schemas.DietConfigurationVersion"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diet = await db.scalar(
            select(models.DietConfigurationVersion).where(
                models.DietConfigurationVersion.diet_id == diet_id,
                models.DietConfigurationVersion.version
                == (
                    select(func.max(models.DietConfigurationVersion.version))
                    .where(models.DietConfigurationVersion.diet_id == diet_id)
                    .scalar_subquery()
                ),
            )
        )

    if diet is None:
        return None

    return schemas.DietConfigurationVersion.from_model(diet)


async def resolve_latest_diet_output_version(
    info: "context.Info", diet_id: int
) -> Optional["schemas.DietOutputVersion"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diet = await db.scalar(
            select(models.DietOutputVersion).where(
                models.DietOutputVersion.diet_id == diet_id,
                models.DietOutputVersion.version
                == (
                    select(func.max(models.DietOutputVersion.version)).where(
                        models.DietOutputVersion.diet_id == diet_id
                    )
                ),
            )
        )

    if diet is None:
        return None

    return schemas.DietOutputVersion.from_model(diet)


async def resolve_diet_configuration_version_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.DietConfigurationVersion"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [schemas.DietConfigurationVersion.parse_node_id(x) for x in node_ids]
    diet_ids = set(x[0] for x in nodes)
    versions = set(x[1] for x in nodes)
    async with DB.async_session() as db:
        versions = await db.scalars(
            select(models.DietConfigurationVersion).where(
                models.DietConfigurationVersion.diet_id.in_(diet_ids),
                models.DietConfigurationVersion.version.in_(versions),
            )
        )

        return utils.make_relay_result(
            nodes,
            versions,
            required,
            schemas.DietConfigurationVersion.make_node_id,
            schemas.DietConfigurationVersion.from_model,
        )


async def resolve_diet_output_version_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.DietOutputVersion"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [schemas.DietOutputVersion.parse_node_id(x) for x in node_ids]
    diet_ids = set(x[0] for x in nodes)
    versions = set(x[1] for x in nodes)
    async with DB.async_session() as db:
        versions = await db.scalars(
            select(models.DietOutputVersion).where(
                models.DietOutputVersion.diet_id.in_(diet_ids),
                models.DietOutputVersion.version.in_(versions),
            )
        )

        return utils.make_relay_result(
            nodes,
            versions,
            required,
            schemas.DietOutputVersion.make_node_id,
            schemas.DietOutputVersion.from_model,
        )


async def resolve_diet_configuration_version_profiles(
    info: "context.Info", node_id: str
) -> list["schemas.Profile"]:
    if not context.has_org(info.context.user):
        raise AuthError

    diet_id, version = schemas.DietConfigurationVersion.parse_node_id(node_id)
    async with DB.async_session() as db:
        profiles = await db.scalars(
            select(models.Profile)
            .join(models.DietProfileConfiguration)
            .join(models.Diet)
            .where(
                models.Diet.organization_id == info.context.user.org_id,
                models.DietProfileConfiguration.diet_id == diet_id,
                models.DietProfileConfiguration.configuration_version == version,
            )
            .order_by(models.DietProfileConfiguration.order.desc())
        )

        return [schemas.Profile.from_model(x) for x in profiles]


async def resolve_diet_ingredient_nutrient_output_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.DietIngredientNutrientOutput"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [schemas.DietIngredientNutrientOutput.parse_node_id(x) for x in node_ids]
    diet_ids = set(x[0] for x in nodes)
    versions = set(x[1] for x in nodes)
    ingredient_ids = set(x[2] for x in nodes)
    nutrient_ids = set(x[3] for x in nodes)
    async with DB.async_session() as db:
        outputs = await db.scalars(
            select(models.DietIngredientNutrientOutput).where(
                models.DietIngredientNutrientOutput.diet_id.in_(diet_ids),
                models.DietIngredientNutrientOutput.version.in_(versions),
                models.DietIngredientNutrientOutput.ingredient_id.in_(ingredient_ids),
                models.DietIngredientNutrientOutput.nutrient_id.in_(nutrient_ids),
            )
        )

        return utils.make_relay_result(
            nodes,
            outputs,
            required,
            schemas.DietIngredientNutrientOutput.make_node_id,
            schemas.DietIngredientNutrientOutput.from_model,
        )


async def resolve_diet_ingredient_output_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.DietIngredientOutput"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [schemas.DietIngredientOutput.parse_node_id(x) for x in node_ids]
    diet_ids = set(x[0] for x in nodes)
    versions = set(x[1] for x in nodes)
    ingredient_ids = set(x[2] for x in nodes)
    async with DB.async_session() as db:
        outputs = await db.scalars(
            select(models.DietIngredientOutput).where(
                models.DietIngredientOutput.diet_id.in_(diet_ids),
                models.DietIngredientOutput.version.in_(versions),
                models.DietIngredientOutput.ingredient_id.in_(ingredient_ids),
            )
        )

        return utils.make_relay_result(
            nodes,
            outputs,
            required,
            schemas.DietIngredientOutput.make_node_id,
            schemas.DietIngredientOutput.from_model,
        )


async def resolve_diet_ingredient_output_nutrients(
    info: "context.Info", node_id: str
) -> list["schemas.DietIngredientNutrientOutput"]:
    if not context.has_org(info.context.user):
        raise AuthError

    diet_id, version, ingredient_id = schemas.DietIngredientOutput.parse_node_id(
        node_id
    )
    async with DB.async_session() as db:
        nutrients = await db.scalars(
            select(models.DietIngredientNutrientOutput)
            .join(models.Nutrient)
            .where(
                models.DietIngredientNutrientOutput.diet_id == diet_id,
                models.DietIngredientNutrientOutput.version == version,
                models.DietIngredientNutrientOutput.ingredient_id == ingredient_id,
            )
            .order_by(models.Nutrient.name)
        )

        return [schemas.DietIngredientNutrientOutput.from_model(x) for x in nutrients]


async def resolve_diet_summary_output_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.DietSummaryOutput"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [schemas.DietSummaryOutput.parse_node_id(x) for x in node_ids]
    diet_ids = set(x[0] for x in nodes)
    versions = set(x[1] for x in nodes)
    async with DB.async_session() as db:
        outputs = await db.scalars(
            select(models.DietSummaryOutput).where(
                models.DietSummaryOutput.diet_id.in_(diet_ids),
                models.DietSummaryOutput.version.in_(versions),
            )
        )

        return utils.make_relay_result(
            nodes,
            outputs,
            required,
            schemas.DietSummaryOutput.make_node_id,
            schemas.DietSummaryOutput.from_model,
        )


async def resolve_diet_output_version_summary(
    info: "context.Info", node_id: str
) -> "schemas.DietSummaryOutput":
    if not context.has_org(info.context.user):
        raise AuthError

    diet_id, version = schemas.DietOutputVersion.parse_node_id(node_id)
    async with DB.async_session() as db:
        output = await db.scalar(
            select(models.DietSummaryOutput).where(
                models.DietSummaryOutput.diet_id == diet_id,
                models.DietSummaryOutput.version == version,
            )
        )

        if output is None:
            raise Exception("Diet Summary Output not found")

        return schemas.DietSummaryOutput.from_model(output)


async def resolve_diet_output_version_ingredients(
    info: "context.Info", node_id: str
) -> list["schemas.DietIngredientOutput"]:
    if not context.has_org(info.context.user):
        raise AuthError

    diet_id, version = schemas.DietOutputVersion.parse_node_id(node_id)
    async with DB.async_session() as db:
        ingredients = await db.scalars(
            select(models.DietIngredientOutput)
            .join(models.Ingredient)
            .where(
                models.DietIngredientOutput.diet_id == diet_id,
                models.DietIngredientOutput.version == version,
            )
            .order_by(models.Ingredient.name)
        )

        return [schemas.DietIngredientOutput.from_model(x) for x in ingredients]
