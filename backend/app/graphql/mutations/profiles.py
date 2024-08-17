from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError
from sqlalchemy.orm import selectinload


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
        if not utils.is_value(input.ingredient_id) and not utils.is_value(
            input.ingredient_category_id
        ):
            raise Exception(
                "Ingredient or ingredient category is required for ProfileIngredientConstraint"
            )

        if utils.is_value(input.ingredient_id):
            ingredient = await db.get(
                models.Ingredient, int(input.ingredient_id.node_id)
            )

            if ingredient is None or (
                ingredient.organization_id is not None
                and ingredient.organization_id != info.context.user.org_id
            ):
                raise Exception("Ingredient not found")

        if utils.is_value(input.ingredient_category_id):
            ingredient_category = await db.get(
                models.IngredientCategory, int(input.ingredient_category_id.node_id)
            )

            if ingredient_category is None or (
                ingredient_category.organization_id is not None
                and ingredient_category.organization_id != info.context.user.org_id
            ):
                raise Exception("Ingredient category not found")

        if utils.is_value(input.reference_ingredient_id):
            reference_ingredient = await db.get(
                models.Ingredient, int(input.reference_ingredient_id.node_id)
            )

            if reference_ingredient is None or (
                reference_ingredient.organization_id is not None
                and reference_ingredient.organization_id != info.context.user.org_id
            ):
                raise Exception("Reference ingredient not found")

        if utils.is_value(input.reference_ingredient_category_id):
            reference_ingredient_category = await db.get(
                models.IngredientCategory,
                int(input.reference_ingredient_category_id.node_id),
            )

            if reference_ingredient_category is None or (
                reference_ingredient_category.organization_id is not None
                and reference_ingredient_category.organization_id
                != info.context.user.org_id
            ):
                raise Exception("Reference ingredient category not found")

        profile_ingredient_constraint = models.ProfileIngredientConstraint(
            profile_id=int(input.profile_id.node_id),
            ingredient_id=(
                int(input.ingredient_id.node_id)
                if utils.is_value(input.ingredient_id)
                else None
            ),
            ingredient_category_id=(
                int(input.ingredient_category_id.node_id)
                if utils.is_value(input.ingredient_category_id)
                else None
            ),
            type=input.type.value,
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
            reference_ingredient_category_id=(
                int(input.reference_ingredient_category_id.node_id)
                if utils.is_value(input.reference_ingredient_category_id)
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
            if (
                input.ingredient_id is None
                and input.type == schemas.IngredientConstraintType.INGREDIENT
            ):
                raise Exception(
                    "Ingredient is required for ProfileIngredientConstraint"
                )
            elif input.ingredient_id is None:
                profile_ingredient_constraint.ingredient_id = None
            else:
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

        if utils.is_set(input.ingredient_category_id):
            if (
                input.ingredient_category_id is None
                and input.type == schemas.IngredientConstraintType.INGREDIENT
            ):
                raise Exception(
                    "Ingredient category is required for ProfileIngredientConstraint"
                )
            elif input.ingredient_category_id is None:
                profile_ingredient_constraint.ingredient_category_id = None
            else:
                ingredient_category = await db.get(
                    models.IngredientCategory, int(input.ingredient_category_id.node_id)
                )

                if ingredient_category is None:
                    raise Exception("Ingredient category not found")

                if (
                    ingredient_category.organization_id is not None
                    and ingredient_category.organization_id != info.context.user.org_id
                ):
                    raise Exception("Ingredient category not found")

                profile_ingredient_constraint.ingredient_category_id = int(
                    input.ingredient_category_id.node_id
                )

        if utils.is_set(input.ingredient_category_id):
            if input.ingredient_category_id is None:
                raise Exception(
                    "Ingredient category is required for ProfileIngredientConstraint"
                )

            ingredient_category = await db.get(
                models.IngredientCategory, int(input.ingredient_category_id.node_id)
            )

            if ingredient_category is None:
                raise Exception("Ingredient category not found")

            if (
                ingredient_category.organization_id is not None
                and ingredient_category.organization_id != info.context.user.org_id
            ):
                raise Exception("Ingredient category not found")

            profile_ingredient_constraint.ingredient_category_id = int(
                input.ingredient_category_id.node_id
            )

        if utils.is_set(input.mode):
            if input.mode is None:
                raise Exception("mode is required for ProfileIngredientConstraint")

            profile_ingredient_constraint.mode = input.mode.value

        if utils.is_set(input.type):
            if input.type is None:
                raise Exception("type is required for ProfileIngredientConstraint")

            if (
                input.type == schemas.IngredientConstraintType.INGREDIENT
                and not utils.is_value(input.ingredient_id)
            ):
                raise Exception(
                    "ingredient_id is required for ProfileIngredientConstraint"
                )
            if (
                input.type == schemas.IngredientConstraintType.INGREDIENT_CATEGORY
                and not utils.is_value(input.ingredient_category_id)
            ):
                raise Exception(
                    "ingredient_category_id is required for ProfileIngredientConstraint"
                )

            profile_ingredient_constraint.type = input.type.value

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
            if (
                input.reference_ingredient_id is None
                and input.type == schemas.IngredientConstraintType.INGREDIENT
                and input.mode == schemas.IngredientConstraintMode.REFERENCE
            ):
                raise Exception(
                    "Reference ingredient is required for ProfileIngredientConstraint"
                )
            elif input.reference_ingredient_id is None:
                profile_ingredient_constraint.reference_ingredient_id = None
            else:
                # get the reference ingredient
                reference_ingredient = await db.get(
                    models.Ingredient, int(input.reference_ingredient_id.node_id)
                )

                if reference_ingredient is None or (
                    reference_ingredient.organization_id is not None
                    and reference_ingredient.organization_id != info.context.user.org_id
                ):
                    raise Exception("Reference ingredient not found")

                profile_ingredient_constraint.reference_ingredient_id = int(
                    input.reference_ingredient_id.node_id
                )

        if utils.is_set(input.reference_ingredient_category_id):
            if (
                input.reference_ingredient_category_id is None
                and input.type == schemas.IngredientConstraintType.INGREDIENT_CATEGORY
                and input.mode == schemas.IngredientConstraintMode.REFERENCE
            ):
                raise Exception(
                    "Reference ingredient category is required for ProfileIngredientConstraint"
                )
            elif input.reference_ingredient_category_id is None:
                profile_ingredient_constraint.reference_ingredient_category_id = None
            else:
                # get the reference ingredient category
                reference_ingredient_category = await db.get(
                    models.IngredientCategory,
                    int(input.reference_ingredient_category_id.node_id),
                )

                if reference_ingredient_category is None or (
                    reference_ingredient_category.organization_id is not None
                    and reference_ingredient_category.organization_id
                    != info.context.user.org_id
                ):
                    raise Exception("Reference ingredient category not found")

                profile_ingredient_constraint.reference_ingredient_category_id = int(
                    input.reference_ingredient_category_id.node_id
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
        if utils.is_value(input.nutrient_id):
            nutrient = await db.get(models.Nutrient, int(input.nutrient_id.node_id))

            if nutrient is None or (
                nutrient.organization_id is not None
                and nutrient.organization_id != info.context.user.org_id
            ):
                raise Exception("Nutrient not found")

        if utils.is_value(input.nutrient_category_id):
            nutrient_category = await db.get(
                models.NutrientCategory, int(input.nutrient_category_id.node_id)
            )

            if nutrient_category is None or (
                nutrient_category.organization_id is not None
                and nutrient_category.organization_id != info.context.user.org_id
            ):
                raise Exception("Nutrient category not found")

        if utils.is_value(input.reference_nutrient_id):
            reference_nutrient = await db.get(
                models.Nutrient, int(input.reference_nutrient_id.node_id)
            )

            if reference_nutrient is None or (
                reference_nutrient.organization_id is not None
                and reference_nutrient.organization_id != info.context.user.org_id
            ):
                raise Exception("Reference nutrient not found")

        if utils.is_value(input.reference_nutrient_category_id):
            reference_nutrient_category = await db.get(
                models.NutrientCategory,
                int(input.reference_nutrient_category_id.node_id),
            )

            if reference_nutrient_category is None or (
                reference_nutrient_category.organization_id is not None
                and reference_nutrient_category.organization_id
                != info.context.user.org_id
            ):
                raise Exception("Reference nutrient category not found")

        if (
            input.type == schemas.NutrientConstraintType.NUTRIENT
            and not utils.is_value(input.nutrient_id)
        ):
            raise Exception("Nutrient is required for ProfileNutrientConstraint")

        if (
            input.type == schemas.NutrientConstraintType.NUTRIENT_CATEGORY
            and not utils.is_value(input.nutrient_category_id)
        ):
            raise Exception(
                "Nutrient category is required for ProfileNutrientConstraint"
            )

        if (
            input.mode == schemas.NutrientConstraintMode.REFERENCE
            and not utils.is_value(input.reference_nutrient_id)
            and not utils.is_value(input.reference_nutrient_category_id)
        ):
            raise Exception(
                "Reference nutrient or reference nutrient category is required for ProfileNutrientConstraint"
            )

        if (
            input.mode == schemas.NutrientConstraintMode.REFERENCE
            and input.type == schemas.NutrientConstraintType.NUTRIENT
            and not utils.is_value(input.reference_nutrient_id)
        ):
            raise Exception(
                "Reference nutrient is required for ProfileNutrientConstraint"
            )

        profile_nutrient_constraint = models.ProfileNutrientConstraint(
            profile_id=int(input.profile_id.node_id),
            nutrient_id=(
                int(input.nutrient_id.node_id)
                if utils.is_value(input.nutrient_id)
                else None
            ),
            nutrient_category_id=(
                int(input.nutrient_category_id.node_id)
                if utils.is_value(input.nutrient_category_id)
                else None
            ),
            type=input.type.value,
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
            reference_nutrient_category_id=(
                int(input.reference_nutrient_category_id.node_id)
                if utils.is_value(input.reference_nutrient_category_id)
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
            if (
                input.nutrient_id is None
                and input.type == schemas.NutrientConstraintType.NUTRIENT
            ):
                raise Exception("Nutrient is required for ProfileNutrientConstraint")
            elif input.nutrient_id is None:
                profile_nutrient_constraint.nutrient_id = None
            else:
                nutrient = await db.get(models.Nutrient, int(input.nutrient_id.node_id))

                if nutrient is None:
                    raise Exception("Nutrient not found")

                if (
                    nutrient.organization_id is not None
                    and nutrient.organization_id != info.context.user.org_id
                ):
                    raise Exception("Nutrient not found")

                profile_nutrient_constraint.nutrient_id = int(input.nutrient_id.node_id)

        if utils.is_set(input.nutrient_category_id):
            if (
                input.nutrient_category_id is None
                and input.type == schemas.NutrientConstraintType.NUTRIENT_CATEGORY
            ):
                raise Exception(
                    "Nutrient category is required for ProfileNutrientConstraint"
                )
            elif input.nutrient_category_id is None:
                profile_nutrient_constraint.nutrient_category_id = None
            else:
                nutrient_category = await db.get(
                    models.NutrientCategory, int(input.nutrient_category_id.node_id)
                )

                if nutrient_category is None:
                    raise Exception("Nutrient category not found")

                if (
                    nutrient_category.organization_id is not None
                    and nutrient_category.organization_id != info.context.user.org_id
                ):
                    raise Exception("Nutrient category not found")

                profile_nutrient_constraint.nutrient_category_id = int(
                    input.nutrient_category_id.node_id
                )

        if utils.is_set(input.type):
            if input.type is None:
                raise Exception("type is required for ProfileNutrientConstraint")

            if (
                input.type == schemas.NutrientConstraintType.NUTRIENT
                and not utils.is_value(input.nutrient_id)
            ):
                raise Exception("nutrient_id is required for ProfileNutrientConstraint")
            if (
                input.type == schemas.NutrientConstraintType.NUTRIENT_CATEGORY
                and not utils.is_value(input.nutrient_category_id)
            ):
                raise Exception(
                    "nutrient_category_id is required for ProfileNutrientConstraint"
                )

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
            if (
                input.reference_nutrient_id is None
                and input.type == schemas.NutrientConstraintType.NUTRIENT
                and input.mode == schemas.NutrientConstraintMode.REFERENCE
            ):
                raise Exception(
                    "Reference nutrient is required for ProfileNutrientConstraint"
                )
            elif input.reference_nutrient_id is None:
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

        if utils.is_set(input.reference_nutrient_category_id):
            if (
                input.reference_nutrient_category_id is None
                and input.type == schemas.NutrientConstraintType.NUTRIENT_CATEGORY
                and input.mode == schemas.NutrientConstraintMode.REFERENCE
            ):
                raise Exception(
                    "Reference nutrient category is required for ProfileNutrientConstraint"
                )
            elif input.reference_nutrient_category_id is None:
                profile_nutrient_constraint.reference_nutrient_category_id = None
            else:
                # get the reference nutrient category
                reference_nutrient_category = await db.get(
                    models.NutrientCategory,
                    int(input.reference_nutrient_category_id.node_id),
                )

                if reference_nutrient_category is None:
                    raise Exception("Reference nutrient category not found")

                if (
                    reference_nutrient_category.organization_id is not None
                    and reference_nutrient_category.organization_id
                    != info.context.user.org_id
                ):
                    raise Exception("Reference nutrient category not found")

                profile_nutrient_constraint.reference_nutrient_category_id = int(
                    input.reference_nutrient_category_id.node_id
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
        ingredient = await db.get(models.Ingredient, int(input.ingredient_id.node_id))

        if ingredient is None or (
            ingredient.organization_id is not None
            and ingredient.organization_id != info.context.user.org_id
        ):
            raise Exception("Ingredient not found")

        nutrient = await db.get(models.Nutrient, int(input.nutrient_id.node_id))

        if nutrient is None or (
            nutrient.organization_id is not None
            and nutrient.organization_id != info.context.user.org_id
        ):
            raise Exception("Nutrient not found")

        profile_ingredient_nutrient_value = models.ProfileIngredientNutrientValue(
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

        if utils.is_set(input.ingredient_id):
            if input.ingredient_id is None:
                raise Exception(
                    "ingredient_id is required for ProfileIngredientNutrientValue"
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

            profile_ingredient_nutrient_value.ingredient_id = int(
                input.ingredient_id.node_id
            )

        if utils.is_set(input.nutrient_id):
            if input.nutrient_id is None:
                raise Exception(
                    "nutrient_id is required for ProfileIngredientNutrientValue"
                )

            nutrient = await db.get(models.Nutrient, int(input.nutrient_id.node_id))

            if nutrient is None:
                raise Exception("Nutrient not found")

            if (
                nutrient.organization_id is not None
                and nutrient.organization_id != info.context.user.org_id
            ):
                raise Exception("Nutrient not found")

            profile_ingredient_nutrient_value.nutrient_id = int(
                input.nutrient_id.node_id
            )

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


async def create_profile_nutrient_value(
    info: context.Info, input: "schemas.CreateProfileNutrientValueInput"
) -> "schemas.ProfileNutrientValue":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile = await db.get(models.Profile, int(input.profile_id.node_id))

        if profile is None or (
            profile.organization_id is not None
            and profile.organization_id != info.context.user.org_id
        ):
            raise Exception("Profile not found")

        nutrient = await db.get(models.Nutrient, int(input.nutrient_id.node_id))

        if nutrient is None or (
            nutrient.organization_id is not None
            and nutrient.organization_id != info.context.user.org_id
        ):
            raise Exception("Nutrient not found")

        profile_nutrient_value = models.ProfileNutrientValue(
            profile_id=int(input.profile_id.node_id),
            nutrient_id=int(input.nutrient_id.node_id),
            gross_energy=(
                input.gross_energy if utils.is_value(input.gross_energy) else None
            ),
            gross_energy_unit_id=(
                input.gross_energy_unit_id.node_id
                if utils.is_value(input.gross_energy_unit_id)
                else None
            ),
            digestible_energy=(
                input.digestible_energy
                if utils.is_value(input.digestible_energy)
                else None
            ),
            digestible_energy_unit_id=(
                input.digestible_energy_unit_id.node_id
                if utils.is_value(input.digestible_energy_unit_id)
                else None
            ),
            metabolizable_energy=(
                input.metabolizable_energy
                if utils.is_value(input.metabolizable_energy)
                else None
            ),
            metabolizable_energy_unit_id=(
                input.metabolizable_energy_unit_id.node_id
                if utils.is_value(input.metabolizable_energy_unit_id)
                else None
            ),
            net_energy=input.net_energy if utils.is_value(input.net_energy) else None,
            net_energy_unit_id=(
                input.net_energy_unit_id.node_id
                if utils.is_value(input.net_energy_unit_id)
                else None
            ),
        )
        db.add(profile_nutrient_value)
        await db.commit()

        return schemas.ProfileNutrientValue.from_model(profile_nutrient_value)


async def update_profile_nutrient_value(
    info: context.Info, input: "schemas.UpdateProfileNutrientValueInput"
) -> "schemas.ProfileNutrientValue":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_nutrient_value = await db.get(
            models.ProfileNutrientValue,
            int(input.id.node_id),
            options=[
                selectinload(models.ProfileNutrientValue.profile),
            ],
        )

        if profile_nutrient_value is None:
            raise Exception("Profile nutrient value not found")

        if (
            profile_nutrient_value.profile.organization_id is not None
            and profile_nutrient_value.profile.organization_id
            != info.context.user.org_id
        ):
            raise Exception("Profile nutrient value not found")

        if utils.is_set(input.nutrient_id):
            if input.nutrient_id is None:
                raise Exception("nutrient_id is required for ProfileNutrientValue")

            nutrient = await db.get(models.Nutrient, int(input.nutrient_id.node_id))

            if nutrient is None:
                raise Exception("Nutrient not found")

            if (
                nutrient.organization_id is not None
                and nutrient.organization_id != info.context.user.org_id
            ):
                raise Exception("Nutrient not found")

            profile_nutrient_value.nutrient_id = int(input.nutrient_id.node_id)

        if utils.is_set(input.gross_energy):
            profile_nutrient_value.gross_energy = input.gross_energy

        if utils.is_set(input.gross_energy_unit_id):
            profile_nutrient_value.gross_energy_unit_id = (
                input.gross_energy_unit_id.node_id
                if input.gross_energy_unit_id is not None
                else None
            )

        if utils.is_set(input.digestible_energy):
            profile_nutrient_value.digestible_energy = input.digestible_energy

        if utils.is_set(input.digestible_energy_unit_id):
            profile_nutrient_value.digestible_energy_unit_id = (
                input.digestible_energy_unit_id.node_id
                if input.digestible_energy_unit_id is not None
                else None
            )

        if utils.is_set(input.metabolizable_energy):
            profile_nutrient_value.metabolizable_energy = input.metabolizable_energy

        if utils.is_set(input.metabolizable_energy_unit_id):
            profile_nutrient_value.metabolizable_energy_unit_id = (
                input.metabolizable_energy_unit_id.node_id
                if input.metabolizable_energy_unit_id is not None
                else None
            )

        if utils.is_set(input.net_energy):
            profile_nutrient_value.net_energy = input.net_energy

        if utils.is_set(input.net_energy_unit_id):
            profile_nutrient_value.net_energy_unit_id = (
                input.net_energy_unit_id.node_id
                if input.net_energy_unit_id is not None
                else None
            )

        await db.commit()

        return schemas.ProfileNutrientValue.from_model(profile_nutrient_value)


async def delete_profile_nutrient_value(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            profile_nutrient_value = await db.get(
                models.ProfileNutrientValue,
                int(id.node_id),
                options=[
                    selectinload(models.ProfileNutrientValue.profile),
                ],
            )

            if profile_nutrient_value is None:
                raise Exception("Profile nutrient value not found")

            if (
                profile_nutrient_value.profile.organization_id is not None
                and profile_nutrient_value.profile.organization_id
                != info.context.user.org_id
            ):
                raise Exception("Profile nutrient value not found")

            profile_nutrient_value.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)


async def create_profile_ingredient_cost(
    info: context.Info, input: "schemas.CreateProfileIngredientCostInput"
) -> "schemas.ProfileIngredientCost":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile = await db.get(models.Profile, int(input.profile_id.node_id))

        if profile is None or (
            profile.organization_id is None
            or profile.organization_id != info.context.user.org_id
        ):
            raise Exception("Profile not found")

        ingredient = await db.get(models.Ingredient, int(input.ingredient_id.node_id))

        if ingredient is None or (
            ingredient.organization_id is not None
            and ingredient.organization_id != info.context.user.org_id
        ):
            raise Exception("Ingredient not found")

        profile_ingredient_cost = models.ProfileIngredientCost(
            profile_id=int(input.profile_id.node_id),
            ingredient_id=int(input.ingredient_id.node_id),
            mode=input.mode.value,
            literal_cost=(
                input.literal_cost if utils.is_value(input.literal_cost) else None
            ),
            literal_cost_unit_id=(
                input.literal_cost_unit_id.node_id
                if utils.is_value(input.literal_cost_unit_id)
                else None
            ),
        )
        db.add(profile_ingredient_cost)
        await db.commit()

        return schemas.ProfileIngredientCost.from_model(profile_ingredient_cost)


async def update_profile_ingredient_cost(
    info: context.Info, input: "schemas.UpdateProfileIngredientCostInput"
) -> "schemas.ProfileIngredientCost":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        profile_ingredient_cost = await db.get(
            models.ProfileIngredientCost,
            int(input.id.node_id),
            options=[
                selectinload(models.ProfileIngredientCost.profile),
            ],
        )

        if profile_ingredient_cost is None:
            raise Exception("Profile ingredient cost not found")

        if (
            profile_ingredient_cost.profile.organization_id is not None
            and profile_ingredient_cost.profile.organization_id
            != info.context.user.org_id
        ):
            raise Exception("Profile ingredient cost not found")

        if utils.is_set(input.ingredient_id):
            if input.ingredient_id is None:
                raise Exception("ingredient_id is required for ProfileIngredientCost")

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

            profile_ingredient_cost.ingredient_id = int(input.ingredient_id.node_id)

        if utils.is_set(input.mode):
            if input.mode is None:
                raise Exception("mode is required for ProfileIngredientCost")

            profile_ingredient_cost.mode = input.mode.value

        if utils.is_set(input.literal_cost):
            profile_ingredient_cost.literal_cost = input.literal_cost

        if utils.is_set(input.literal_cost_unit_id):
            profile_ingredient_cost.literal_cost_unit_id = (
                input.literal_cost_unit_id.node_id
                if input.literal_cost_unit_id is not None
                else None
            )

        await db.commit()

        return schemas.ProfileIngredientCost.from_model(profile_ingredient_cost)


async def delete_profile_ingredient_cost(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            profile_ingredient_cost = await db.get(
                models.ProfileIngredientCost,
                int(id.node_id),
                options=[
                    selectinload(models.ProfileIngredientCost.profile),
                ],
            )

            if profile_ingredient_cost is None:
                raise Exception("Profile ingredient cost not found")

            if (
                profile_ingredient_cost.profile.organization_id is not None
                and profile_ingredient_cost.profile.organization_id
                != info.context.user.org_id
            ):
                raise Exception("Profile ingredient cost not found")

            profile_ingredient_cost.archived = True

        await db.commit()

        return schemas.DeletedNode(success=True)
