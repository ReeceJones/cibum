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


class Loaders:
    def __init__(self) -> None:
        self.nutrient_category = DataLoader(load_fn=_load_nutrient_category)
        self.nutrient = DataLoader(load_fn=_load_nutrient)
        self.ingredient_category = DataLoader(load_fn=_load_ingredient_category)
        self.ingredient = DataLoader(load_fn=_load_ingredient)
