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


class Unit(Base):
    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(index=True)
    type: Mapped[str] = mapped_column(index=True)
    symbol: Mapped[str] = mapped_column(index=True)
    base_unit_multiplier: Mapped[float] = mapped_column(default=1.0)
    base_unit_offset: Mapped[float] = mapped_column(default=0.0)


class ProfileIngredientNutrientValue(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profile.id"))
    ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredient.id"))
    nutrient_id: Mapped[int] = mapped_column(ForeignKey("nutrient.id"))
    value: Mapped[float]
    unit_id: Mapped[str] = mapped_column(ForeignKey("unit.id"))

    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="profile_ingredient_nutrient_values"
    )
    unit: Mapped[Unit] = relationship(
        "Unit", foreign_keys="ProfileIngredientNutrientValue.unit_id"
    )


class ProfileIngredientConstraint(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profile.id"))
    ingredient_id: Mapped[int | None] = mapped_column(ForeignKey("ingredient.id"))
    ingredient_category_id: Mapped[int | None] = mapped_column(
        ForeignKey("ingredientcategory.id")
    )
    type: Mapped[str]
    mode: Mapped[str]
    operator: Mapped[str]
    literal_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    literal_value: Mapped[float | None]
    reference_ingredient_id: Mapped[int | None] = mapped_column(
        ForeignKey("ingredient.id")
    )
    reference_ingredient_category_id: Mapped[int | None] = mapped_column(
        ForeignKey("ingredientcategory.id")
    )

    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="profile_ingredient_constraints"
    )
    literal_unit: Mapped[Unit] = relationship(
        "Unit", foreign_keys="ProfileIngredientConstraint.literal_unit_id"
    )


class ProfileNutrientConstraint(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profile.id"))
    nutrient_id: Mapped[int | None] = mapped_column(ForeignKey("nutrient.id"))
    nutrient_category_id: Mapped[int | None] = mapped_column(
        ForeignKey("nutrientcategory.id")
    )
    type: Mapped[str]
    mode: Mapped[str]
    operator: Mapped[str]
    literal_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    literal_value: Mapped[float | None]
    reference_nutrient_id: Mapped[int | None] = mapped_column(ForeignKey("nutrient.id"))
    reference_nutrient_category_id: Mapped[int | None] = mapped_column(
        ForeignKey("nutrientcategory.id")
    )

    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="profile_nutrient_constraints"
    )
    literal_unit: Mapped[Unit] = relationship(
        "Unit", foreign_keys="ProfileNutrientConstraint.literal_unit_id"
    )


class ProfileConstraint(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profile.id"))
    type: Mapped[str]
    mode: Mapped[str]
    operator: Mapped[str]
    literal_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    literal_value: Mapped[float | None]

    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="profile_constraints"
    )
    literal_unit: Mapped[Unit] = relationship(
        "Unit", foreign_keys="ProfileConstraint.literal_unit_id"
    )


class ProfileNutrientValue(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profile.id"))
    nutrient_id: Mapped[int] = mapped_column(ForeignKey("nutrient.id"))
    gross_energy: Mapped[float | None]
    gross_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    digestible_energy: Mapped[float | None]
    digestible_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    metabolizable_energy: Mapped[float | None]
    metabolizable_energy_unit_id: Mapped[str | None] = mapped_column(
        ForeignKey("unit.id")
    )
    net_energy: Mapped[float | None]
    net_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))

    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="profile_nutrient_values"
    )
    gross_energy_unit: Mapped[Unit] = relationship(
        "Unit", foreign_keys="ProfileNutrientValue.gross_energy_unit_id"
    )
    digestible_energy_unit: Mapped[Unit] = relationship(
        "Unit", foreign_keys="ProfileNutrientValue.digestible_energy_unit_id"
    )
    metabolizable_energy_unit: Mapped[Unit] = relationship(
        "Unit", foreign_keys="ProfileNutrientValue.metabolizable_energy_unit_id"
    )
    net_energy_unit: Mapped[Unit] = relationship(
        "Unit", foreign_keys="ProfileNutrientValue.net_energy_unit_id"
    )


class ProfileIngredientCost(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profile.id"))
    ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredient.id"))
    mode: Mapped[str]
    literal_cost: Mapped[float | None]
    literal_cost_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))

    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="profile_ingredient_costs"
    )
    literal_cost_unit: Mapped[Unit] = relationship(
        "Unit", foreign_keys="ProfileIngredientCost.literal_cost_unit_id"
    )


class Profile(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[str | None] = mapped_column(ForeignKey("organization.id"))
    managed: Mapped[bool] = mapped_column(default=False)
    managed_key: Mapped[str | None] = mapped_column(index=True)
    name: Mapped[str] = mapped_column(index=True)
    description: Mapped[str | None]

    profile_constraints: Mapped[list[ProfileConstraint]] = relationship(
        "ProfileConstraint",
        back_populates="profile",
    )
    profile_ingredient_constraints: Mapped[list[ProfileIngredientConstraint]] = (
        relationship(
            "ProfileIngredientConstraint",
            back_populates="profile",
        )
    )
    profile_nutrient_constraints: Mapped[list[ProfileNutrientConstraint]] = (
        relationship(
            "ProfileNutrientConstraint",
            back_populates="profile",
        )
    )
    profile_ingredient_nutrient_values: Mapped[list[ProfileIngredientNutrientValue]] = (
        relationship(
            "ProfileIngredientNutrientValue",
            back_populates="profile",
        )
    )
    profile_nutrient_values: Mapped[list[ProfileNutrientValue]] = relationship(
        "ProfileNutrientValue",
        back_populates="profile",
    )
    profile_ingredient_costs: Mapped[list[ProfileIngredientCost]] = relationship(
        "ProfileIngredientCost",
        back_populates="profile",
    )


class DietProfileConfiguration(Base):
    diet_id: Mapped[int] = mapped_column(ForeignKey("diet.id"), primary_key=True)
    configuration_version: Mapped[int] = mapped_column(primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profile.id"), primary_key=True)
    order: Mapped[int] = mapped_column(index=True)

    profile: Mapped[Profile] = relationship("Profile")


class DietConfigurationVersion(Base):
    diet_id: Mapped[int] = mapped_column(ForeignKey("diet.id"), primary_key=True)
    version: Mapped[int] = mapped_column(primary_key=True)


class DietOutputVersion(Base):
    diet_id: Mapped[int] = mapped_column(ForeignKey("diet.id"), primary_key=True)
    version: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[str] = mapped_column(index=True)


class DietIngredientOutput(Base):
    diet_id: Mapped[int] = mapped_column(ForeignKey("diet.id"), primary_key=True)
    version: Mapped[int] = mapped_column(primary_key=True)
    ingredient_id: Mapped[int] = mapped_column(
        ForeignKey("ingredient.id"), primary_key=True
    )
    amount: Mapped[float]
    amount_unit_id: Mapped[str] = mapped_column(ForeignKey("unit.id"))
    cost: Mapped[float | None]
    cost_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    gross_energy: Mapped[float | None]
    gross_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    digestible_energy: Mapped[float | None]
    digestible_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    metabolizable_energy: Mapped[float | None]
    metabolizable_energy_unit_id: Mapped[str | None] = mapped_column(
        ForeignKey("unit.id")
    )
    net_energy: Mapped[float | None]
    net_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))


class DietIngredientNutrientOutput(Base):
    diet_id: Mapped[int] = mapped_column(ForeignKey("diet.id"), primary_key=True)
    version: Mapped[int] = mapped_column(primary_key=True)
    ingredient_id: Mapped[int] = mapped_column(
        ForeignKey("ingredient.id"), primary_key=True
    )
    nutrient_id: Mapped[int] = mapped_column(
        ForeignKey("nutrient.id"), primary_key=True
    )
    amount: Mapped[float]
    amount_unit_id: Mapped[str] = mapped_column(ForeignKey("unit.id"))
    gross_energy: Mapped[float | None]
    gross_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    digestible_energy: Mapped[float | None]
    digestible_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    metabolizable_energy: Mapped[float | None]
    metabolizable_energy_unit_id: Mapped[str | None] = mapped_column(
        ForeignKey("unit.id")
    )
    net_energy: Mapped[float | None]
    net_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))


class DietSummaryOutput(Base):
    diet_id: Mapped[int] = mapped_column(ForeignKey("diet.id"), primary_key=True)
    version: Mapped[int] = mapped_column(primary_key=True)
    cost: Mapped[float | None]
    cost_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    gross_energy: Mapped[float | None]
    gross_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    digestible_energy: Mapped[float | None]
    digestible_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))
    metabolizable_energy: Mapped[float | None]
    metabolizable_energy_unit_id: Mapped[str | None] = mapped_column(
        ForeignKey("unit.id")
    )
    net_energy: Mapped[float | None]
    net_energy_unit_id: Mapped[str | None] = mapped_column(ForeignKey("unit.id"))


class Diet(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[str] = mapped_column(ForeignKey("organization.id"))
    name: Mapped[str] = mapped_column(index=True)
    description: Mapped[str | None]
