from sqlalchemy.orm import selectinload

from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError


async def create_profile(
    info: context.Info, input: "schemas.CreateProfileInput"
) -> "schemas.Profile":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile = models.Profile(
            organization_id=info.context.user.org_id,
            name=input.name,
            description=input.description,
        )
        db.add(profile)
        await db.commit()

        return schemas.Profile.from_model(profile)


async def update_profile(
    info: context.Info, input: "schemas.UpdateProfileInput"
) -> "schemas.Profile":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile = await db.get(models.Profile, int(input.id.node_id))

        if profile is None:
            raise Exception("Profile not found")

        if (
            profile.organization_id is not None
            and profile.organization_id != info.context.user.org_id
        ):
            raise Exception("Profile not found")

        if profile.managed:
            raise Exception("Cannot update managed profile")

        if utils.is_set(input.name):
            if input.name is None:
                raise Exception("Name is required for Profile")
            profile.name = input.name

        if utils.is_set(input.description):
            profile.description = input.description

        await db.commit()

        return schemas.Profile.from_model(profile)


async def delete_profile(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            profile = await db.get(models.Profile, int(id.node_id))

            if profile is None:
                raise Exception("Profile not found")

            if (
                profile.organization_id is not None
                and profile.organization_id != info.context.user.org_id
            ):
                raise Exception("Profile not found")

            if profile.managed:
                raise Exception("Cannot delete managed profile")

            profile.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)


async def create_profile_constraint(
    info: context.Info, input: "schemas.CreateProfileConstraintInput"
) -> "schemas.ProfileConstraint":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_constraint = models.ProfileConstraint(
            organization_id=info.context.user.org_id,
            profile_id=int(input.profile_id.node_id),
        )
        db.add(profile_constraint)
        await db.commit()

        return schemas.ProfileConstraint.from_model(profile_constraint)


async def update_profile_constraint(
    info: context.Info, input: "schemas.UpdateProfileConstraintInput"
) -> "schemas.ProfileConstraint":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_constraint = await db.get(
            models.ProfileConstraint,
            int(input.id.node_id),
            options=[selectinload(models.ProfileConstraint.profile)],
        )

        if profile_constraint is None:
            raise Exception("Profile constraint not found")

        if (
            profile_constraint.profile.organization_id is not None
            and profile_constraint.profile.organization_id != info.context.user.org_id
        ):
            raise Exception("Profile constraint not found")

        await db.commit()

        return schemas.ProfileConstraint.from_model(profile_constraint)


async def delete_profile_constraint(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            profile_constraint = await db.get(models.ProfileConstraint, int(id.node_id))

            if profile_constraint is None:
                raise Exception("Profile constraint not found")

            if (
                profile_constraint.profile.organization_id is not None
                and profile_constraint.profile.organization_id
                != info.context.user.org_id
            ):
                raise Exception("Profile constraint not found")

            profile_constraint.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)


async def create_profile_ingredient_constraint(
    info: context.Info, input: "schemas.CreateProfileIngredientConstraintInput"
) -> "schemas.ProfileIngredientConstraint":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_ingredient_constraint = models.ProfileIngredientConstraint(
            profile_id=int(input.profile_id.node_id),
            ingredient_id=int(input.ingredient_id.node_id),
            mode=input.mode.value,
            operator=input.operator.value,
            literal_unit_id=(
                input.literal_unit_id.node_id
                if utils.is_value(input.literal_unit_id)
                else None
            ),
            literal_value=(
                input.literal_value if utils.is_value(input.literal_value) else None
            ),
            reference_ingredient_id=(
                int(input.reference_ingredient_id.node_id)
                if utils.is_value(input.reference_ingredient_id)
                else None
            ),
        )
        db.add(profile_ingredient_constraint)
        await db.commit()

        return schemas.ProfileIngredientConstraint.from_model(
            profile_ingredient_constraint
        )


async def update_profile_ingredient_constraint(
    info: context.Info, input: "schemas.UpdateProfileIngredientConstraintInput"
) -> "schemas.ProfileIngredientConstraint":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_ingredient_constraint = await db.get(
            models.ProfileIngredientConstraint,
            int(input.id.node_id),
            options=[
                selectinload(models.ProfileIngredientConstraint.profile),
            ],
        )

        if profile_ingredient_constraint is None:
            raise Exception("Profile ingredient constraint not found")

        if (
            profile_ingredient_constraint.profile.organization_id is not None
            and profile_ingredient_constraint.profile.organization_id
            != info.context.user.org_id
        ):
            raise Exception("Profile ingredient constraint not found")

        if utils.is_set(input.ingredient_id):
            if input.ingredient_id is None:
                raise Exception(
                    "Ingredient is required for ProfileIngredientConstraint"
                )

            ingredient = await db.get(
                models.Ingredient, int(input.ingredient_id.node_id)
            )

            if ingredient is None:
                raise Exception("Ingredient not found")

            if (
                ingredient.organization_id is not None
                and ingredient.organization_id != info.context.user.org_id
            ):
                raise Exception("Ingredient not found")

            profile_ingredient_constraint.ingredient_id = int(
                input.ingredient_id.node_id
            )

        if utils.is_set(input.mode):
            if input.mode is None:
                raise Exception("mode is required for ProfileIngredientConstraint")

            profile_ingredient_constraint.mode = input.mode.value

        if utils.is_set(input.operator):
            if input.operator is None:
                raise Exception("operator is required for ProfileIngredientConstraint")
            profile_ingredient_constraint.operator = input.operator.value

        if utils.is_set(input.literal_unit_id):
            profile_ingredient_constraint.literal_unit_id = (
                input.literal_unit_id.node_id
                if input.literal_unit_id is not None
                else None
            )

        if utils.is_set(input.literal_value):
            profile_ingredient_constraint.literal_value = input.literal_value

        if utils.is_set(input.reference_ingredient_id):
            if input.reference_ingredient_id is None:
                profile_ingredient_constraint.reference_ingredient_id = None
            else:
                # get the reference ingredient
                reference_ingredient = await db.get(
                    models.Ingredient, int(input.reference_ingredient_id.node_id)
                )

                if reference_ingredient is None:
                    raise Exception("Reference ingredient not found")

                if (
                    reference_ingredient.organization_id is not None
                    and reference_ingredient.organization_id != info.context.user.org_id
                ):
                    raise Exception("Reference ingredient not found")

                profile_ingredient_constraint.reference_ingredient_id = int(
                    input.reference_ingredient_id.node_id
                )

        await db.commit()

        return schemas.ProfileIngredientConstraint.from_model(
            profile_ingredient_constraint
        )


async def delete_profile_ingredient_constraint(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            profile_ingredient_constraint = await db.get(
                models.ProfileIngredientConstraint,
                int(id.node_id),
                options=[
                    selectinload(models.ProfileIngredientConstraint.profile),
                ],
            )

            if profile_ingredient_constraint is None:
                raise Exception("Profile ingredient constraint not found")

            if (
                profile_ingredient_constraint.profile.organization_id is not None
                and profile_ingredient_constraint.profile.organization_id
                != info.context.user.org_id
            ):
                raise Exception("Profile ingredient constraint not found")

            profile_ingredient_constraint.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)


async def create_profile_nutrient_constraint(
    info: context.Info, input: "schemas.CreateProfileNutrientConstraintInput"
) -> "schemas.ProfileNutrientConstraint":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_nutrient_constraint = models.ProfileNutrientConstraint(
            profile_id=int(input.profile_id.node_id),
            nutrient_id=int(input.nutrient_id.node_id),
            mode=input.mode.value,
            operator=input.operator.value,
            literal_unit_id=(
                input.literal_unit_id.node_id
                if utils.is_value(input.literal_unit_id)
                else None
            ),
            literal_value=(
                input.literal_value if utils.is_value(input.literal_value) else None
            ),
            reference_nutrient_id=(
                int(input.reference_nutrient_id.node_id)
                if utils.is_value(input.reference_nutrient_id)
                else None
            ),
        )
        db.add(profile_nutrient_constraint)
        await db.commit()

        return schemas.ProfileNutrientConstraint.from_model(profile_nutrient_constraint)


async def update_profile_nutrient_constraint(
    info: context.Info, input: "schemas.UpdateProfileNutrientConstraintInput"
) -> "schemas.ProfileNutrientConstraint":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_nutrient_constraint = await db.get(
            models.ProfileNutrientConstraint,
            int(input.id.node_id),
            options=[
                selectinload(models.ProfileNutrientConstraint.profile),
            ],
        )

        if profile_nutrient_constraint is None:
            raise Exception("Profile nutrient constraint not found")

        if (
            profile_nutrient_constraint.profile.organization_id is not None
            and profile_nutrient_constraint.profile.organization_id
            != info.context.user.org_id
        ):
            raise Exception("Profile nutrient constraint not found")

        if utils.is_set(input.nutrient_id):
            if input.nutrient_id is None:
                raise Exception("Nutrient is required for ProfileNutrientConstraint")

            nutrient = await db.get(models.Nutrient, int(input.nutrient_id.node_id))

            if nutrient is None:
                raise Exception("Nutrient not found")

            if (
                nutrient.organization_id is not None
                and nutrient.organization_id != info.context.user.org_id
            ):
                raise Exception("Nutrient not found")

            profile_nutrient_constraint.nutrient_id = int(input.nutrient_id.node_id)

        if utils.is_set(input.mode):
            if input.mode is None:
                raise Exception("mode is required for ProfileNutrientConstraint")

            profile_nutrient_constraint.mode = input.mode.value

        if utils.is_set(input.operator):
            if input.operator is None:
                raise Exception("operator is required for ProfileNutrientConstraint")
            profile_nutrient_constraint.operator = input.operator.value

        if utils.is_set(input.literal_unit_id):
            profile_nutrient_constraint.literal_unit_id = (
                input.literal_unit_id.node_id
                if input.literal_unit_id is not None
                else None
            )

        if utils.is_set(input.literal_value):
            profile_nutrient_constraint.literal_value = input.literal_value

        if utils.is_set(input.reference_nutrient_id):
            if input.reference_nutrient_id is None:
                profile_nutrient_constraint.reference_nutrient_id = None
            else:
                # get the reference nutrient
                reference_nutrient = await db.get(
                    models.Nutrient, int(input.reference_nutrient_id.node_id)
                )

                if reference_nutrient is None:
                    raise Exception("Reference nutrient not found")

                if (
                    reference_nutrient.organization_id is not None
                    and reference_nutrient.organization_id != info.context.user.org_id
                ):
                    raise Exception("Reference nutrient not found")

                profile_nutrient_constraint.reference_nutrient_id = int(
                    input.reference_nutrient_id.node_id
                )

        await db.commit()

        return schemas.ProfileNutrientConstraint.from_model(profile_nutrient_constraint)


async def delete_profile_nutrient_constraint(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            profile_nutrient_constraint = await db.get(
                models.ProfileNutrientConstraint,
                int(id.node_id),
                options=[
                    selectinload(models.ProfileNutrientConstraint.profile),
                ],
            )

            if profile_nutrient_constraint is None:
                raise Exception("Profile nutrient constraint not found")

            if (
                profile_nutrient_constraint.profile.organization_id is not None
                and profile_nutrient_constraint.profile.organization_id
                != info.context.user.org_id
            ):
                raise Exception("Profile nutrient constraint not found")

            profile_nutrient_constraint.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)


async def create_profile_ingredient_nutrient_value(
    info: context.Info, input: "schemas.CreateProfileIngredientNutrientValueInput"
) -> "schemas.ProfileIngredientNutrientValue":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_ingredient_nutrient_value = models.ProfileIngredientNutrientValue(
            organization_id=info.context.user.org_id,
            profile_id=int(input.profile_id.node_id),
            ingredient_id=int(input.ingredient_id.node_id),
            nutrient_id=int(input.nutrient_id.node_id),
            value=input.value,
            unit_id=input.unit_id.node_id,
        )
        db.add(profile_ingredient_nutrient_value)
        await db.commit()

        return schemas.ProfileIngredientNutrientValue.from_model(
            profile_ingredient_nutrient_value
        )


async def update_profile_ingredient_nutrient_value(
    info: context.Info, input: "schemas.UpdateProfileIngredientNutrientValueInput"
) -> "schemas.ProfileIngredientNutrientValue":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_ingredient_nutrient_value = await db.get(
            models.ProfileIngredientNutrientValue,
            int(input.id.node_id),
            options=[
                selectinload(models.ProfileIngredientNutrientValue.profile),
            ],
        )

        if profile_ingredient_nutrient_value is None:
            raise Exception("Profile ingredient nutrient value not found")

        if (
            profile_ingredient_nutrient_value.profile.organization_id is not None
            and profile_ingredient_nutrient_value.profile.organization_id
            != info.context.user.org_id
        ):
            raise Exception("Profile ingredient nutrient value not found")

        if utils.is_set(input.value):
            if input.value is None:
                raise Exception("value is required for ProfileIngredientNutrientValue")

            profile_ingredient_nutrient_value.value = input.value

        if utils.is_set(input.unit_id):
            if input.unit_id is None:
                raise Exception(
                    "unit_id is required for ProfileIngredientNutrientValue"
                )

            profile_ingredient_nutrient_value.unit_id = input.unit_id.node_id

        await db.commit()

        return schemas.ProfileIngredientNutrientValue.from_model(
            profile_ingredient_nutrient_value
        )


async def delete_profile_ingredient_nutrient_value(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            profile_ingredient_nutrient_value = await db.get(
                models.ProfileIngredientNutrientValue,
                int(id.node_id),
                options=[
                    selectinload(models.ProfileIngredientNutrientValue.profile),
                ],
            )

            if profile_ingredient_nutrient_value is None:
                raise Exception("Profile ingredient nutrient value not found")

            if (
                profile_ingredient_nutrient_value.profile.organization_id is not None
                and profile_ingredient_nutrient_value.profile.organization_id
                != info.context.user.org_id
            ):
                raise Exception("Profile ingredient nutrient value not found")

            profile_ingredient_nutrient_value.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)


async def create_profile_pandalist_rule(
    info: context.Info, input: "schemas.CreateProfilePandalistRuleInput"
) -> "schemas.ProfilePandalistRule":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_pandalist_rule = models.ProfilePandalistRule(
            organization_id=info.context.user.org_id,
            profile_id=int(input.profile_id.node_id),
            scope=input.scope.value,
            mode=input.mode.value,
        )
        db.add(profile_pandalist_rule)
        await db.commit()

        return schemas.ProfilePandalistRule.from_model(profile_pandalist_rule)


async def update_profile_pandalist_rule(
    info: context.Info, input: "schemas.UpdateProfilePandalistRuleInput"
) -> "schemas.ProfilePandalistRule":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_pandalist_rule = await db.get(
            models.ProfilePandalistRule,
            int(input.id.node_id),
            options=[
                selectinload(models.ProfilePandalistRule.profile),
            ],
        )

        if profile_pandalist_rule is None:
            raise Exception("Profile pandalist rule not found")

        if (
            profile_pandalist_rule.profile.organization_id is not None
            and profile_pandalist_rule.profile.organization_id
            != info.context.user.org_id
        ):
            raise Exception("Profile pandalist rule not found")

        if utils.is_set(input.scope):
            if input.scope is None:
                raise Exception("scope is required for ProfilePandalistRule")

            profile_pandalist_rule.scope = input.scope.value

        if utils.is_set(input.mode):
            if input.mode is None:
                raise Exception("mode is required for ProfilePandalistRule")

            profile_pandalist_rule.mode = input.mode.value

        await db.commit()

        return schemas.ProfilePandalistRule.from_model(profile_pandalist_rule)


async def delete_profile_pandalist_rule(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            profile_pandalist_rule = await db.get(
                models.ProfilePandalistRule, int(id.node_id)
            )

            if profile_pandalist_rule is None:
                raise Exception("Profile pandalist rule not found")

            if (
                profile_pandalist_rule.profile.organization_id is not None
                and profile_pandalist_rule.profile.organization_id
                != info.context.user.org_id
            ):
                raise Exception("Profile pandalist rule not found")

            profile_pandalist_rule.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)
