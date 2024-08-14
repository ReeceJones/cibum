from typing import Iterable, Optional

from sqlalchemy import or_, select

from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError


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


async def resolve_profile_pandalist_rule_nodes(
    info: "context.Info", rule_ids: Iterable[str], required: bool = False
) -> list[Optional["schemas.ProfilePandalistRule"]]:
    if not context.has_org(info.context.user):
        raise AuthError

    nodes = [int(x) for x in rule_ids]
    async with DB.async_session() as db:
        rules = await db.scalars(
            select(models.ProfilePandalistRule)
            .join(models.Profile)
            .where(
                or_(
                    models.Profile.organization_id == None,
                    models.Profile.organization_id == info.context.user.org_id,
                ),
                models.ProfilePandalistRule.id.in_(nodes),
                models.ProfilePandalistRule.archived == False,
            )
        )

        return utils.make_relay_result(
            nodes,
            rules,
            required,
            lambda x: x.id,
            schemas.ProfilePandalistRule.from_model,
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
