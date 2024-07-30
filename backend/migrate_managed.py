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
    name: str
    description: str | None = None
    children: list["ManagedNutrientNode"] | None = None


async def migrate_managed_nutrient_category(
    db: AsyncSession,
    node: ManagedNutrientNode,
    parent_id: int | None = None,
) -> None:
    existing_category = await db.scalar(
        select(models.NutrientCategory).where(
            models.NutrientCategory.name == node.name,
            models.NutrientCategory.parent_nutrient_category_id == parent_id,
            models.NutrientCategory.managed == True,
        )
    )

    if existing_category is None:
        new_category = models.NutrientCategory(
            name=node.name,
            description=node.description,
            parent_nutrient_category_id=parent_id,
            managed=True,
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
            models.Nutrient.name == node.name,
            models.Nutrient.nutrient_category_id == parent_id,
            models.Nutrient.managed == True,
        )
    )

    if existing_nutrient is None:
        new_nutrient = models.Nutrient(
            name=node.name,
            description=node.description,
            nutrient_category_id=parent_id,
            managed=True,
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


async def run_nutrient_migrations():
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


async def main():
    await run_nutrient_migrations()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
