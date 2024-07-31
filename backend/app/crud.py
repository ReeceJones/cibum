from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models


async def ensure_user(
    db: AsyncSession,
    user_id: str,
) -> None:
    user = models.User(id=user_id)
    await db.merge(user)
    await db.commit()


async def ensure_org_membership(
    db: AsyncSession,
    user_id: str,
    org_id: str | None,
) -> None:
    if org_id is None:
        return

    org = models.Organization(id=org_id)
    await db.merge(org)
    await db.flush()
    org_membership = models.OrganizationMembership(
        user_id=user_id, organization_id=org_id
    )
    await db.merge(org_membership)
    await db.commit()


async def get_nutrient_categories_with_overrides(
    db: AsyncSession,
    ids: list[int],
) -> list[
    tuple[models.NutrientCategory, models.ManagedNutrientCategoryOverride | None]
]:
    nutrient_categories = await db.scalars(
        select(models.NutrientCategory).where(
            models.NutrientCategory.id.in_(ids),
            models.NutrientCategory.archived == False,
        )
    )

    nutrient_category_overrides = await db.scalars(
        select(models.ManagedNutrientCategoryOverride).where(
            models.ManagedNutrientCategoryOverride.nutrient_category_id.in_(ids),
            models.ManagedNutrientCategoryOverride.archived == False,
        )
    )

    nutrient_category_overrides_dict: dict[
        int, models.ManagedNutrientCategoryOverride
    ] = {x.nutrient_category_id: x for x in nutrient_category_overrides}

    return [
        (x, nutrient_category_overrides_dict.get(x.id)) for x in nutrient_categories
    ]


async def get_nutrients_with_overrides(
    db: AsyncSession,
    ids: list[int],
) -> list[tuple[models.Nutrient, models.ManagedNutrientOverride | None]]:
    nutrients = await db.scalars(
        select(models.Nutrient).where(
            models.Nutrient.id.in_(ids),
            models.Nutrient.archived == False,
        )
    )

    nutrient_overrides = await db.scalars(
        select(models.ManagedNutrientOverride).where(
            models.ManagedNutrientOverride.nutrient_id.in_(ids),
            models.ManagedNutrientOverride.archived == False,
        )
    )

    nutrient_overrides_dict: dict[int, models.ManagedNutrientOverride] = {
        x.nutrient_id: x for x in nutrient_overrides
    }

    return [(x, nutrient_overrides_dict.get(x.id)) for x in nutrients]


async def get_child_nutrient_categories_with_overrides(
    db: AsyncSession,
    id: int,
    org_id: str,
) -> list[
    tuple[models.NutrientCategory, models.ManagedNutrientCategoryOverride | None]
]:
    nutrient_categories = await db.scalars(
        select(models.NutrientCategory).where(
            models.NutrientCategory.parent_nutrient_category_id == id,
            or_(
                models.NutrientCategory.organization_id == org_id,
                models.NutrientCategory.organization_id == None,
            ),
            models.NutrientCategory.archived == False,
        )
    )

    nutrient_category_overrides = await db.scalars(
        select(models.ManagedNutrientCategoryOverride).where(
            models.ManagedNutrientCategoryOverride.nutrient_category_id.in_(
                [x.id for x in nutrient_categories]
            ),
            models.ManagedNutrientCategoryOverride.organization_id == org_id,
            models.ManagedNutrientCategoryOverride.archived == False,
        )
    )

    nutrient_category_overrides_dict: dict[
        int, models.ManagedNutrientCategoryOverride
    ] = {x.nutrient_category_id: x for x in nutrient_category_overrides}

    return [
        (x, nutrient_category_overrides_dict.get(x.id)) for x in nutrient_categories
    ]


async def get_child_nutrients_with_overrides(
    db: AsyncSession,
    id: int,
    org_id: str,
) -> list[tuple[models.Nutrient, models.ManagedNutrientOverride | None]]:
    nutrients = await db.scalars(
        select(models.Nutrient).where(
            models.Nutrient.nutrient_category_id == id,
            or_(
                models.Nutrient.organization_id == org_id,
                models.Nutrient.organization_id == None,
            ),
            models.Nutrient.archived == False,
        )
    )

    nutrient_overrides = await db.scalars(
        select(models.ManagedNutrientOverride).where(
            models.ManagedNutrientOverride.nutrient_id.in_([x.id for x in nutrients]),
            models.ManagedNutrientOverride.organization_id == org_id,
            models.ManagedNutrientOverride.archived == False,
        )
    )

    nutrient_overrides_dict: dict[int, models.ManagedNutrientOverride] = {
        x.nutrient_id: x for x in nutrient_overrides
    }

    return [(x, nutrient_overrides_dict.get(x.id)) for x in nutrients]


async def get_ingredient_categories_with_overrides(
    db: AsyncSession,
    ids: list[int],
) -> list[
    tuple[
        models.IngredientCategory,
        models.ManagedIngredientCategoryOverride | None,
    ]
]:
    ingredient_categories = await db.scalars(
        select(models.IngredientCategory).where(
            models.IngredientCategory.id.in_(ids),
            models.IngredientCategory.archived == False,
        )
    )

    ingredient_category_overrides = await db.scalars(
        select(models.ManagedIngredientCategoryOverride).where(
            models.ManagedIngredientCategoryOverride.ingredient_category_id.in_(ids),
            models.ManagedIngredientCategoryOverride.archived == False,
        )
    )

    ingredient_category_overrides_dict: dict[
        int, models.ManagedIngredientCategoryOverride
    ] = {x.ingredient_category_id: x for x in ingredient_category_overrides}

    return [
        (x, ingredient_category_overrides_dict.get(x.id)) for x in ingredient_categories
    ]


async def get_ingredients_with_overrides(
    db: AsyncSession,
    ids: list[int],
) -> list[tuple[models.Ingredient, models.ManagedIngredientOverride | None]]:
    ingredients = await db.scalars(
        select(models.Ingredient).where(
            models.Ingredient.id.in_(ids),
            models.Ingredient.archived == False,
        )
    )

    ingredient_overrides = await db.scalars(
        select(models.ManagedIngredientOverride).where(
            models.ManagedIngredientOverride.ingredient_id.in_(ids),
            models.ManagedIngredientOverride.archived == False,
        )
    )

    ingredient_overrides_dict: dict[int, models.ManagedIngredientOverride] = {
        x.ingredient_id: x for x in ingredient_overrides
    }

    return [(x, ingredient_overrides_dict.get(x.id)) for x in ingredients]


async def get_child_ingredient_categories_with_overrides(
    db: AsyncSession,
    id: int,
    org_id: str,
) -> list[
    tuple[
        models.IngredientCategory,
        models.ManagedIngredientCategoryOverride | None,
    ]
]:
    ingredient_categories = await db.scalars(
        select(models.IngredientCategory).where(
            models.IngredientCategory.parent_ingredient_category_id == id,
            or_(
                models.IngredientCategory.organization_id == org_id,
                models.IngredientCategory.organization_id == None,
            ),
            models.IngredientCategory.archived == False,
        )
    )

    ingredient_category_overrides = await db.scalars(
        select(models.ManagedIngredientCategoryOverride).where(
            models.ManagedIngredientCategoryOverride.ingredient_category_id.in_(
                [x.id for x in ingredient_categories]
            ),
            models.ManagedIngredientCategoryOverride.organization_id == org_id,
            models.ManagedIngredientCategoryOverride.archived == False,
        )
    )

    ingredient_category_overrides_dict: dict[
        int, models.ManagedIngredientCategoryOverride
    ] = {x.ingredient_category_id: x for x in ingredient_category_overrides}

    return [
        (x, ingredient_category_overrides_dict.get(x.id)) for x in ingredient_categories
    ]


async def get_child_ingredients_with_overrides(
    db: AsyncSession,
    id: int,
    org_id: str,
) -> list[
    tuple[
        models.Ingredient,
        models.ManagedIngredientOverride | None,
    ]
]:
    ingredients = await db.scalars(
        select(models.Ingredient).where(
            models.Ingredient.ingredient_category_id == id,
            or_(
                models.Ingredient.organization_id == org_id,
                models.Ingredient.organization_id == None,
            ),
            models.Ingredient.archived == False,
        )
    )

    ingredient_overrides = await db.scalars(
        select(models.ManagedIngredientOverride).where(
            models.ManagedIngredientOverride.ingredient_id.in_(
                [x.id for x in ingredients]
            ),
            models.ManagedIngredientOverride.organization_id == org_id,
            models.ManagedIngredientOverride.archived == False,
        )
    )

    ingredient_overrides_dict: dict[int, models.ManagedIngredientOverride] = {
        x.ingredient_id: x for x in ingredient_overrides
    }

    return [(x, ingredient_overrides_dict.get(x.id)) for x in ingredients]
