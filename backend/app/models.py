from abc import abstractmethod
from datetime import datetime
from typing import Any, Optional

from sqlalchemy import TIMESTAMP, ForeignKey, String
from sqlalchemy.orm import (DeclarativeBase, Mapped, declared_attr,
                            mapped_column, relationship)


class Base(DeclarativeBase):
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    type_annotation_map = {datetime: TIMESTAMP(timezone=True)}

    archived: Mapped[bool] = mapped_column(default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now, onupdate=datetime.now
    )

    @abstractmethod
    def get_id(self) -> Any: ...


class Organization(Base):
    id: Mapped[str] = mapped_column(String, primary_key=True)


class User(Base):
    id: Mapped[str] = mapped_column(String, primary_key=True)


class OrganizationMembership(Base):
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id"), primary_key=True)
    organization_id: Mapped[str] = mapped_column(
        ForeignKey("organization.id"), primary_key=True
    )


class NutrientCategory(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[str | None] = mapped_column(ForeignKey("organization.id"))
    parent_nutrient_category_id: Mapped[int | None] = mapped_column(
        ForeignKey("nutrientcategory.id")
    )
    name: Mapped[str] = mapped_column(index=True)
    description: Mapped[str | None]
    managed: Mapped[bool] = mapped_column(default=False)
    managed_key: Mapped[str | None] = mapped_column(index=True)

    parent_nutrient_category: Mapped[Optional["NutrientCategory"]] = relationship(
        "NutrientCategory",
        remote_side="NutrientCategory.id",
        back_populates="child_nutrient_categories",
    )
    child_nutrient_categories: Mapped[list["NutrientCategory"]] = relationship(
        "NutrientCategory",
        remote_side="NutrientCategory.parent_nutrient_category_id",
        back_populates="parent_nutrient_category",
    )
    nutrients: Mapped[list["Nutrient"]] = relationship(
        "Nutrient",
        back_populates="nutrient_category",
    )
    managed_nutrient_category_overrides: Mapped[
        list["ManagedNutrientCategoryOverride"]
    ] = relationship(
        "ManagedNutrientCategoryOverride",
        back_populates="nutrient_category",
    )


class Nutrient(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[str | None] = mapped_column(ForeignKey("organization.id"))
    nutrient_category_id: Mapped[int | None] = mapped_column(
        ForeignKey("nutrientcategory.id")
    )
    name: Mapped[str] = mapped_column(index=True)
    description: Mapped[str | None]
    managed: Mapped[bool] = mapped_column(default=False)
    managed_key: Mapped[str | None] = mapped_column(index=True)

    nutrient_category: Mapped[NutrientCategory] = relationship(
        "NutrientCategory",
        back_populates="nutrients",
    )
    managed_nutrient_overrides: Mapped[list["ManagedNutrientOverride"]] = relationship(
        "ManagedNutrientOverride",
        back_populates="nutrient",
    )
    ingredient_nutrients: Mapped[list["IngredientNutrient"]] = relationship(
        "IngredientNutrient",
        back_populates="nutrient",
    )


class ManagedNutrientCategoryOverride(Base):
    organization_id: Mapped[str] = mapped_column(
        ForeignKey("organization.id"), primary_key=True
    )
    nutrient_category_id: Mapped[int] = mapped_column(
        ForeignKey("nutrientcategory.id"), primary_key=True
    )
    name: Mapped[str | None] = mapped_column(index=True)
    description: Mapped[str | None]

    nutrient_category: Mapped[NutrientCategory] = relationship(
        "NutrientCategory",
        back_populates="managed_nutrient_category_overrides",
    )


class ManagedNutrientOverride(Base):
    organization_id: Mapped[str] = mapped_column(
        ForeignKey("organization.id"), primary_key=True
    )
    nutrient_id: Mapped[int] = mapped_column(
        ForeignKey("nutrient.id"), primary_key=True
    )
    name: Mapped[str | None] = mapped_column(index=True)
    description: Mapped[str | None]

    nutrient: Mapped[Nutrient] = relationship(
        "Nutrient",
        back_populates="managed_nutrient_overrides",
    )


class IngredientCategory(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[str | None] = mapped_column(ForeignKey("organization.id"))
    parent_ingredient_category_id: Mapped[int | None] = mapped_column(
        ForeignKey("ingredientcategory.id")
    )
    name: Mapped[str] = mapped_column(index=True)
    description: Mapped[str | None]
    managed: Mapped[bool] = mapped_column(default=False)
    managed_key: Mapped[str | None] = mapped_column(index=True)

    parent_ingredient_category: Mapped[Optional["IngredientCategory"]] = relationship(
        "IngredientCategory",
        remote_side="IngredientCategory.id",
        back_populates="child_ingredient_categories",
    )
    child_ingredient_categories: Mapped[list["IngredientCategory"]] = relationship(
        "IngredientCategory",
        remote_side="IngredientCategory.parent_ingredient_category_id",
        back_populates="parent_ingredient_category",
    )
    ingredients: Mapped[list["Ingredient"]] = relationship(
        "Ingredient",
        back_populates="ingredient_category",
    )
    managed_ingredient_category_overrides: Mapped[
        list["ManagedIngredientCategoryOverride"]
    ] = relationship(
        "ManagedIngredientCategoryOverride",
        back_populates="ingredient_category",
    )


class ManagedIngredientCategoryOverride(Base):
    organization_id: Mapped[str] = mapped_column(
        ForeignKey("organization.id"), primary_key=True
    )
    ingredient_category_id: Mapped[int] = mapped_column(
        ForeignKey("ingredientcategory.id"), primary_key=True
    )
    name: Mapped[str | None] = mapped_column(index=True)
    description: Mapped[str | None]

    ingredient_category: Mapped[IngredientCategory] = relationship(
        "IngredientCategory",
        back_populates="managed_ingredient_category_overrides",
    )


class IngredientNutrient(Base):
    ingredient_id: Mapped[int] = mapped_column(
        ForeignKey("ingredient.id"), primary_key=True
    )
    nutrient_id: Mapped[int] = mapped_column(
        ForeignKey("nutrient.id"), primary_key=True
    )
    organization_id: Mapped[str] = mapped_column(
        ForeignKey("organization.id"), primary_key=True
    )

    ingredient: Mapped["Ingredient"] = relationship(
        "Ingredient",
        back_populates="ingredient_nutrients",
    )
    nutrient: Mapped[Nutrient] = relationship(
        "Nutrient",
        back_populates="ingredient_nutrients",
    )


class Ingredient(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[str | None] = mapped_column(ForeignKey("organization.id"))
    ingredient_category_id: Mapped[int | None] = mapped_column(
        ForeignKey("ingredientcategory.id")
    )
    name: Mapped[str] = mapped_column(index=True)
    description: Mapped[str | None]
    managed: Mapped[bool] = mapped_column(default=False)
    managed_key: Mapped[str | None] = mapped_column(index=True)

    ingredient_category: Mapped[IngredientCategory] = relationship(
        "IngredientCategory",
        back_populates="ingredients",
    )
    managed_ingredient_overrides: Mapped[list["ManagedIngredientOverride"]] = (
        relationship(
            "ManagedIngredientOverride",
            back_populates="ingredient",
        )
    )
    ingredient_nutrients: Mapped[list[IngredientNutrient]] = relationship(
        "IngredientNutrient",
        back_populates="ingredient",
    )


class ManagedIngredientOverride(Base):
    organization_id: Mapped[str] = mapped_column(
        ForeignKey("organization.id"), primary_key=True
    )
    ingredient_id: Mapped[int] = mapped_column(
        ForeignKey("ingredient.id"), primary_key=True
    )
    name: Mapped[str | None] = mapped_column(index=True)
    description: Mapped[str | None]

    ingredient: Mapped[Ingredient] = relationship(
        "Ingredient",
        back_populates="managed_ingredient_overrides",
    )
