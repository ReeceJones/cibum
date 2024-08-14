import asyncio
import json
import logging
from typing import Literal

import aiofiles
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models
from app.db import DB


class ManagedNutrientNode(BaseModel):
    type: Literal["category"] | Literal["nutrient"]
    key: str
    name: str
    description: str | None = None
    children: list["ManagedNutrientNode"] | None = None


class ManagedIngredientNode(BaseModel):
    type: Literal["category"] | Literal["ingredient"]
    key: str
    name: str
    description: str | None = None
    children: list["ManagedIngredientNode"] | None = None


class ManagedUnitNode(BaseModel):
    id: str
    name: str
    symbol: str
    kilogram_multiplier: float
    kilogram_offset: float


async def migrate_managed_nutrient_category(
    db: AsyncSession,
    node: ManagedNutrientNode,
    parent_id: int | None = None,
) -> None:
    existing_category = await db.scalar(
        select(models.NutrientCategory).where(
            models.NutrientCategory.managed_key == node.key,
            models.NutrientCategory.managed == True,
        )
    )

    if existing_category is None:
        new_category = models.NutrientCategory(
            name=node.name,
            description=node.description,
            parent_nutrient_category_id=parent_id,
            managed=True,
            managed_key=node.key,
        )
        db.add(new_category)
        await db.flush()
        category_id = new_category.id
    else:
        category_id = existing_category.id

    if node.children is None:
        return

    for child in node.children:
        await migrate_managed_nutrient_node(db, child, category_id)


async def migrate_managed_nutrient(
    db: AsyncSession,
    node: ManagedNutrientNode,
    parent_id: int | None = None,
) -> None:
    existing_nutrient = await db.scalar(
        select(models.Nutrient).where(
            models.Nutrient.managed_key == node.key,
            models.Nutrient.managed == True,
        )
    )

    if existing_nutrient is None:
        new_nutrient = models.Nutrient(
            name=node.name,
            description=node.description,
            nutrient_category_id=parent_id,
            managed=True,
            managed_key=node.key,
        )
        db.add(new_nutrient)
        await db.flush()
        nutrient_id = new_nutrient.id
    else:
        nutrient_id = existing_nutrient.id

    if node.children is None:
        return

    for child in node.children:
        await migrate_managed_nutrient_node(db, child, nutrient_id)


async def migrate_managed_nutrient_node(
    db: AsyncSession,
    node: ManagedNutrientNode,
    parent_id: int | None = None,
) -> None:
    match node.type:
        case "category":
            await migrate_managed_nutrient_category(db, node, parent_id)
        case "nutrient":
            await migrate_managed_nutrient(db, node, parent_id)
        case _:
            raise ValueError(f"Unknown node type: {node.type}")


async def run_nutrient_migrations() -> None:
    logging.info("Migrating managed nutrients")
    async with aiofiles.open("data/managed_nutrients.json", "r") as f:
        nutrient_data_json = await f.read()
    nutrient_data = json.loads(nutrient_data_json)

    async with DB.async_session() as db:
        for node_raw in nutrient_data:
            logging.info(f"{node_raw}")
            node = ManagedNutrientNode(**node_raw)
            await migrate_managed_nutrient_node(db, node, None)
        await db.commit()


async def migrate_managed_ingredient_category(
    db: AsyncSession,
    node: ManagedIngredientNode,
    parent_id: int | None = None,
) -> None:
    existing_category = await db.scalar(
        select(models.IngredientCategory).where(
            models.IngredientCategory.managed_key == node.key,
            models.IngredientCategory.managed == True,
        )
    )

    if existing_category is None:
        new_category = models.IngredientCategory(
            name=node.name,
            description=node.description,
            parent_ingredient_category_id=parent_id,
            managed=True,
            managed_key=node.key,
        )
        db.add(new_category)
        await db.flush()
        category_id = new_category.id
    else:
        category_id = existing_category.id

    if node.children is None:
        return

    for child in node.children:
        await migrate_managed_ingredient_node(db, child, category_id)


async def migrate_managed_ingredient(
    db: AsyncSession,
    node: ManagedIngredientNode,
    parent_id: int | None = None,
) -> None:
    existing_ingredient = await db.scalar(
        select(models.Ingredient).where(
            models.Ingredient.managed_key == node.key,
            models.Ingredient.managed == True,
        )
    )

    if existing_ingredient is None:
        new_ingredient = models.Ingredient(
            name=node.name,
            description=node.description,
            ingredient_category_id=parent_id,
            managed=True,
            managed_key=node.key,
        )
        db.add(new_ingredient)
        await db.flush()
        ingredient_id = new_ingredient.id
    else:
        ingredient_id = existing_ingredient.id

    if node.children is None:
        return

    for child in node.children:
        await migrate_managed_ingredient_node(db, child, ingredient_id)


async def migrate_managed_ingredient_node(
    db: AsyncSession,
    node: ManagedIngredientNode,
    parent_id: int | None = None,
) -> None:
    match node.type:
        case "category":
            await migrate_managed_ingredient_category(db, node, parent_id)
        case "ingredient":
            await migrate_managed_ingredient(db, node, parent_id)
        case _:
            raise ValueError(f"Unknown node type: {node.type}")


async def run_ingredient_migrations() -> None:
    logging.info("Migrating managed ingredients")
    async with aiofiles.open("data/managed_ingredients.json", "r") as f:
        ingredient_data_json = await f.read()
    ingredient_data = json.loads(ingredient_data_json)

    async with DB.async_session() as db:
        for node_raw in ingredient_data:
            logging.info(f"{node_raw}")
            node = ManagedIngredientNode(**node_raw)
            await migrate_managed_ingredient_node(db, node, None)
        await db.commit()


async def run_unit_migrations() -> None:
    logging.info("Migrating managed units")
    async with aiofiles.open("data/managed_units.json", "r") as f:
        unit_data_json = await f.read()
    unit_data = json.loads(unit_data_json)

    async with DB.async_session() as db:
        for unit_raw in unit_data:
            unit = ManagedUnitNode(**unit_raw)
            node = models.Unit(
                id=unit.id,
                name=unit.name,
                symbol=unit.symbol,
                kilogram_multiplier=unit.kilogram_multiplier,
                kilogram_offset=unit.kilogram_offset,
            )
            await db.merge(node)
        await db.commit()


async def main():
    await run_nutrient_migrations()
    await run_ingredient_migrations()
    await run_unit_migrations()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
