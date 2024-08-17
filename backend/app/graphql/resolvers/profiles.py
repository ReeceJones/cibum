from typing import Iterable, Optional

from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError
from sqlalchemy import or_, select


async def get_profiles(info: "context.Info") -> list["schemas.Profile"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profiles = await db.scalars(
            select(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.Profile.archived == False,
            )
            .order_by(models.Profile.name.asc())
        )

        return [schemas.Profile.from_model(profile) for profile in profiles]


async def resolve_profile_nodes(
    info: "context.Info", node_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.Profile"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in node_ids]
    async with DB.async_session() as db:
        profiles = await db.scalars(
            select(models.Profile).where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.Profile.id.in_(nodes),
                models.Profile.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes, profiles, required, lambda x: x.id, schemas.Profile.from_model
        )


async def resolve_profile_constraint_nodes(
    info: "context.Info", constraint_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.ProfileConstraint"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in constraint_ids]
    async with DB.async_session() as db:
        constraints = await db.scalars(
            select(models.ProfileConstraint)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.ProfileConstraint.id.in_(nodes),
                models.ProfileConstraint.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes,
            constraints,
            required,
            lambda x: x.id,
            schemas.ProfileConstraint.from_model,
        )


async def resolve_profile_nutrient_constraint_nodes(
    info: "context.Info", constraint_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.ProfileNutrientConstraint"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in constraint_ids]
    async with DB.async_session() as db:
        constraints = await db.scalars(
            select(models.ProfileNutrientConstraint)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.ProfileNutrientConstraint.id.in_(nodes),
                models.ProfileNutrientConstraint.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes,
            constraints,
            required,
            lambda x: x.id,
            schemas.ProfileNutrientConstraint.from_model,
        )


async def resolve_profile_ingredient_constraint_nodes(
    info: "context.Info", constraint_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.ProfileIngredientConstraint"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in constraint_ids]
    async with DB.async_session() as db:
        constraints = await db.scalars(
            select(models.ProfileIngredientConstraint)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.ProfileIngredientConstraint.id.in_(nodes),
                models.ProfileIngredientConstraint.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes,
            constraints,
            required,
            lambda x: x.id,
            schemas.ProfileIngredientConstraint.from_model,
        )


async def resolve_profile_ingredient_nutrient_value_nodes(
    info: "context.Info", value_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.ProfileIngredientNutrientValue"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in value_ids]
    async with DB.async_session() as db:
        values = await db.scalars(
            select(models.ProfileIngredientNutrientValue)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.ProfileIngredientNutrientValue.id.in_(nodes),
                models.ProfileIngredientNutrientValue.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes,
            values,
            required,
            lambda x: x.id,
            schemas.ProfileIngredientNutrientValue.from_model,
        )


async def resolve_profile_ingredient_constraints(
    info: "context.Info", profile_id: int
) -> list["schemas.ProfileIngredientConstraint"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        constraints = await db.scalars(
            select(models.ProfileIngredientConstraint)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.Profile.id == profile_id,
                models.ProfileIngredientConstraint.archived == False,
            )
        )

        return [schemas.ProfileIngredientConstraint.from_model(c) for c in constraints]


async def resolve_profile_nutrient_constraints(
    info: "context.Info", profile_id: int
) -> list["schemas.ProfileNutrientConstraint"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        constraints = await db.scalars(
            select(models.ProfileNutrientConstraint)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.Profile.id == profile_id,
                models.ProfileNutrientConstraint.archived == False,
            )
        )

        return [schemas.ProfileNutrientConstraint.from_model(c) for c in constraints]


async def resolve_profile_ingredient_nutrient_values(
    info: "context.Info", profile_id: int
) -> list["schemas.ProfileIngredientNutrientValue"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        values = await db.scalars(
            select(models.ProfileIngredientNutrientValue)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.Profile.id == profile_id,
                models.ProfileIngredientNutrientValue.archived == False,
            )
        )

        return [schemas.ProfileIngredientNutrientValue.from_model(v) for v in values]


async def resolve_profile_nutrient_value_nodes(
    info: "context.Info", value_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.ProfileNutrientValue"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in value_ids]
    async with DB.async_session() as db:
        values = await db.scalars(
            select(models.ProfileNutrientValue)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.ProfileNutrientValue.id.in_(nodes),
                models.ProfileNutrientValue.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes,
            values,
            required,
            lambda x: x.id,
            schemas.ProfileNutrientValue.from_model,
        )


async def resolve_profile_nutrient_values(
    info: "context.Info", profile_id: int
) -> list["schemas.ProfileNutrientValue"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        values = await db.scalars(
            select(models.ProfileNutrientValue)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.Profile.id == profile_id,
                models.ProfileNutrientValue.archived == False,
            )
        )

        return [schemas.ProfileNutrientValue.from_model(v) for v in values]


async def resolve_profile_ingredient_cost_nodes(
    info: "context.Info", cost_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.ProfileIngredientCost"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in cost_ids]
    async with DB.async_session() as db:
        costs = await db.scalars(
            select(models.ProfileIngredientCost)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.ProfileIngredientCost.id.in_(nodes),
                models.ProfileIngredientCost.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes,
            costs,
            required,
            lambda x: x.id,
            schemas.ProfileIngredientCost.from_model,
        )


async def resolve_profile_ingredient_costs(
    info: "context.Info", profile_id: int
) -> list["schemas.ProfileIngredientCost"]:
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        costs = await db.scalars(
            select(models.ProfileIngredientCost)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.Profile.id == profile_id,
                models.ProfileIngredientCost.archived == False,
            )
        )

        return [schemas.ProfileIngredientCost.from_model(c) for c in costs]
