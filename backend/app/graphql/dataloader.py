from typing import TypeVar

from strawberry.dataloader import DataLoader

from app import crud, models
from app.db import DB
from app.graphql import schemas

T = TypeVar("T")
K = TypeVar("K", bound=models.Base)


async def _load_nutrient_category(
    keys: list[int],
) -> list["schemas.NutrientCategory"]:
    async with DB.async_session() as db:
        categories = await crud.get_nutrient_categories_with_overrides(db, keys)
        return [
            schemas.NutrientCategory.from_model(category, override)
            for category, override in categories
        ]


async def _load_nutrient(
    keys: list[int],
) -> list["schemas.Nutrient"]:
    async with DB.async_session() as db:
        nutrients = await crud.get_nutrients_with_overrides(db, keys)
        return [
            schemas.Nutrient.from_model(nutrient, override)
            for nutrient, override in nutrients
        ]


async def _load_ingredient_category(
    keys: list[int],
) -> list["schemas.IngredientCategory"]:
    async with DB.async_session() as db:
        categories = await crud.get_ingredient_categories_with_overrides(db, keys)
        return [
            schemas.IngredientCategory.from_model(category, override)
            for category, override in categories
        ]


async def _load_ingredient(
    keys: list[int],
) -> list["schemas.Ingredient"]:
    async with DB.async_session() as db:
        ingredients = await crud.get_ingredients_with_overrides(db, keys)
        return [
            schemas.Ingredient.from_model(ingredient, override)
            for ingredient, override in ingredients
        ]


async def _load_unit(
    keys: list[str],
) -> list["schemas.Unit"]:
    async with DB.async_session() as db:
        units = await crud.get_units(db, keys)
        return [schemas.Unit.from_model(unit) for unit in units]


async def _load_profile_ingredient_nutrient_value(
    keys: list[int],
) -> list["schemas.ProfileIngredientNutrientValue"]:
    async with DB.async_session() as db:
        values = await crud.get_profile_ingredient_nutrient_values(db, keys)
        return [
            schemas.ProfileIngredientNutrientValue.from_model(value) for value in values
        ]


async def _load_profile_ingredient_constraint(
    keys: list[int],
) -> list["schemas.ProfileIngredientConstraint"]:
    async with DB.async_session() as db:
        constraints = await crud.get_profile_ingredient_constraints(db, keys)
        return [
            schemas.ProfileIngredientConstraint.from_model(constraint)
            for constraint in constraints
        ]


async def _load_profile_nutrient_constraint(
    keys: list[int],
) -> list["schemas.ProfileNutrientConstraint"]:
    async with DB.async_session() as db:
        constraints = await crud.get_profile_nutrient_constraints(db, keys)
        return [
            schemas.ProfileNutrientConstraint.from_model(constraint)
            for constraint in constraints
        ]


async def _load_profile_constraint(
    keys: list[int],
) -> list["schemas.ProfileConstraint"]:
    async with DB.async_session() as db:
        constraints = await crud.get_profile_constraints(db, keys)
        return [
            schemas.ProfileConstraint.from_model(constraint)
            for constraint in constraints
        ]


async def _load_profile(
    keys: list[int],
) -> list["schemas.Profile"]:
    async with DB.async_session() as db:
        profiles = await crud.get_profiles(db, keys)
        return [schemas.Profile.from_model(profile) for profile in profiles]


class Loaders:
    def __init__(self) -> None:
        self.nutrient_category = DataLoader(load_fn=_load_nutrient_category)
        self.nutrient = DataLoader(load_fn=_load_nutrient)
        self.ingredient_category = DataLoader(load_fn=_load_ingredient_category)
        self.ingredient = DataLoader(load_fn=_load_ingredient)
        self.unit = DataLoader(load_fn=_load_unit)
        self.profile_ingredient_nutrient_value = DataLoader(
            load_fn=_load_profile_ingredient_nutrient_value
        )
        self.profile_ingredient_constraint = DataLoader(
            load_fn=_load_profile_ingredient_constraint
        )
        self.profile_nutrient_constraint = DataLoader(
            load_fn=_load_profile_nutrient_constraint
        )
        self.profile_constraint = DataLoader(load_fn=_load_profile_constraint)
        self.profile = DataLoader(load_fn=_load_profile)
