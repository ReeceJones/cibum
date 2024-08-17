from enum import Enum
from typing import Iterable, Optional

import strawberry
import strawberry.fastapi
from app import models
from app.graphql import mutations, resolvers
from app.graphql.auth import IsAuthenticatedWithOrganization
from app.graphql.context import Info, get_context
from app.graphql.utils import global_id, strawberry_id
from strawberry import relay


@strawberry.type
class Nutrient(relay.Node):
    id: relay.NodeID[strawberry.ID]
    nutrient_category_id: relay.GlobalID | None
    name: str
    description: str | None
    managed: bool

    @strawberry.field
    async def nutrient_category(self, info: Info) -> Optional["NutrientCategory"]:
        if self.nutrient_category_id is None:
            return None

        return await info.context.loaders.nutrient_category.load(
            int(self.nutrient_category_id.node_id)
        )

    @staticmethod
    def from_model(
        nutrient: models.Nutrient, override: models.ManagedNutrientOverride | None
    ) -> "Nutrient":
        return Nutrient(
            id=strawberry_id(nutrient.id),
            nutrient_category_id=(
                global_id(NutrientCategory, nutrient.nutrient_category_id)
                if nutrient.nutrient_category_id is not None
                else None
            ),
            name=(
                nutrient.name
                if override is None or override.name is None
                else override.name
            ),
            description=(
                nutrient.description
                if override is None or override.description is None
                else override.description
            ),
            managed=nutrient.managed,
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["Nutrient"]:
        return await resolvers.nutrients.resolve_nutrient_nodes(info, node_ids, required)  # type: ignore


@strawberry.type
class NutrientCategory(relay.Node):
    id: relay.NodeID[strawberry.ID]
    parent_nutrient_category_id: relay.GlobalID | None
    name: str
    description: str | None
    managed: bool

    @strawberry.field
    async def parent_nutrient_category(
        self, info: Info
    ) -> Optional["NutrientCategory"]:
        if self.parent_nutrient_category_id is None:
            return None

        return await info.context.loaders.nutrient_category.load(
            int(self.parent_nutrient_category_id.node_id)
        )

    @strawberry.field
    async def child_nutrient_categories(self, info: Info) -> list["NutrientCategory"]:
        return await resolvers.nutrient_categories.resolve_child_nutrient_categories(
            info,
            int(self.id),
        )

    @strawberry.field
    async def child_nutrients(self, info: Info) -> list[Nutrient]:
        return await resolvers.nutrients.resolve_child_nutrients(info, int(self.id))

    @staticmethod
    def from_model(
        nutrient_category: models.NutrientCategory,
        override: models.ManagedNutrientCategoryOverride | None,
    ) -> "NutrientCategory":
        return NutrientCategory(
            id=strawberry_id(nutrient_category.id),
            parent_nutrient_category_id=(
                None
                if nutrient_category.parent_nutrient_category_id is None
                else global_id(
                    NutrientCategory, nutrient_category.parent_nutrient_category_id
                )
            ),
            name=(
                nutrient_category.name
                if override is None or override.name is None
                else override.name
            ),
            description=(
                nutrient_category.description
                if override is None or override.description is None
                else override.description
            ),
            managed=nutrient_category.managed,
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["NutrientCategory"]:
        return await resolvers.nutrient_categories.resolve_nutrient_category_nodes(info, node_ids, required)  # type: ignore


@strawberry.type
class Ingredient(relay.Node):
    id: relay.NodeID[strawberry.ID]
    ingredient_category_id: relay.GlobalID | None
    name: str
    description: str | None
    managed: bool

    @strawberry.field
    async def ingredient_category(self, info: Info) -> Optional["IngredientCategory"]:
        if self.ingredient_category_id is None:
            return None

        return await info.context.loaders.ingredient_category.load(
            int(self.ingredient_category_id.node_id)
        )

    @staticmethod
    def from_model(
        ingredient: models.Ingredient,
        override: models.ManagedIngredientOverride | None,
    ) -> "Ingredient":
        return Ingredient(
            id=strawberry_id(ingredient.id),
            ingredient_category_id=(
                global_id(IngredientCategory, ingredient.ingredient_category_id)
                if ingredient.ingredient_category_id is not None
                else None
            ),
            name=(
                ingredient.name
                if override is None or override.name is None
                else override.name
            ),
            description=(
                ingredient.description
                if override is None or override.description is None
                else override.description
            ),
            managed=ingredient.managed,
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["Ingredient"]:
        return await resolvers.ingredients.resolve_ingredient_nodes(info, node_ids, required)  # type: ignore


@strawberry.type
class IngredientCategory(relay.Node):
    id: relay.NodeID[strawberry.ID]
    parent_ingredient_category_id: relay.GlobalID | None
    name: str
    description: str | None
    managed: bool

    @strawberry.field
    async def parent_ingredient_category(
        self, info: Info
    ) -> Optional["IngredientCategory"]:
        if self.parent_ingredient_category_id is None:
            return None

        return await info.context.loaders.ingredient_category.load(
            int(self.parent_ingredient_category_id.node_id)
        )

    @strawberry.field
    async def child_ingredient_categories(
        self, info: Info
    ) -> list["IngredientCategory"]:
        return (
            await resolvers.ingredient_categories.resolve_child_ingredient_categories(
                info,
                int(self.id),
            )
        )

    @strawberry.field
    async def ingredients(self, info: Info) -> list[Ingredient]:
        return await resolvers.ingredients.resolve_child_ingredients(info, int(self.id))

    @staticmethod
    def from_model(
        ingredient_category: models.IngredientCategory,
        override: models.ManagedIngredientCategoryOverride | None,
    ) -> "IngredientCategory":
        return IngredientCategory(
            id=strawberry_id(ingredient_category.id),
            parent_ingredient_category_id=(
                None
                if ingredient_category.parent_ingredient_category_id is None
                else global_id(
                    IngredientCategory,
                    ingredient_category.parent_ingredient_category_id,
                )
            ),
            name=(
                ingredient_category.name
                if override is None or override.name is None
                else override.name
            ),
            description=(
                ingredient_category.description
                if override is None or override.description is None
                else override.description
            ),
            managed=ingredient_category.managed,
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["IngredientCategory"]:
        return await resolvers.ingredient_categories.resolve_ingredient_category_nodes(
            info, node_ids, required
        )  # type: ignore


@strawberry.enum
class ConstraintOperator(Enum):
    EQUAL = "EQUAL"
    NOT_EQUAL = "NOT_EQUAL"
    GREATER_THAN = "GREATER_THAN"
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL"
    LESS_THAN = "LESS_THAN"
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL"


@strawberry.enum
class IngredientConstraintType(Enum):
    INGREDIENT = "INGREDIENT"
    INGREDIENT_CATEGORY = "INGREDIENT_CATEGORY"


@strawberry.enum
class IngredientConstraintMode(Enum):
    LITERAL = "LITERAL"
    REFERENCE = "REFERENCE"


@strawberry.enum
class NutrientConstraintType(Enum):
    NUTRIENT = "NUTRIENT"
    NUTRIENT_CATEGORY = "NUTRIENT_CATEGORY"


@strawberry.enum
class NutrientConstraintMode(Enum):
    LITERAL = "LITERAL"
    REFERENCE = "REFERENCE"


@strawberry.enum
class UnitType(Enum):
    CONCENTRATION = "CONCENTRATION"
    ENERGY = "ENERGY"
    COST = "COST"


@strawberry.type
class Unit(relay.Node):
    id: relay.NodeID[strawberry.ID]
    name: str
    symbol: str
    type: UnitType
    base_unit_multiplier: float
    base_unit_offset: float

    @staticmethod
    def from_model(unit: models.Unit) -> "Unit":
        return Unit(
            id=strawberry_id(unit.id),
            name=unit.name,
            symbol=unit.symbol,
            type=UnitType(unit.type),
            base_unit_multiplier=unit.base_unit_multiplier,
            base_unit_offset=unit.base_unit_offset,
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["Unit"]:
        return await resolvers.units.resolve_unit_nodes(info, node_ids, required)  # type: ignore


@strawberry.type
class ProfileIngredientNutrientValue(relay.Node):
    id: relay.NodeID[strawberry.ID]
    profile_id: relay.GlobalID
    ingredient_id: relay.GlobalID
    nutrient_id: relay.GlobalID
    value: float
    unit_id: relay.GlobalID

    @strawberry.field
    async def unit(self, info: Info) -> Unit:
        return await info.context.loaders.unit.load(self.unit_id.node_id)

    @strawberry.field
    async def ingredient(self, info: Info) -> Ingredient:
        return await info.context.loaders.ingredient.load(
            int(self.ingredient_id.node_id)
        )

    @strawberry.field
    async def nutrient(self, info: Info) -> Nutrient:
        return await info.context.loaders.nutrient.load(int(self.nutrient_id.node_id))

    @staticmethod
    def from_model(
        value: models.ProfileIngredientNutrientValue,
    ) -> "ProfileIngredientNutrientValue":
        return ProfileIngredientNutrientValue(
            id=strawberry_id(value.id),
            profile_id=global_id(Profile, value.profile_id),
            ingredient_id=global_id(Ingredient, value.ingredient_id),
            nutrient_id=global_id(Nutrient, value.nutrient_id),
            value=value.value,
            unit_id=global_id(Unit, value.unit_id),
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["ProfileIngredientNutrientValue"]:
        return await resolvers.profiles.resolve_profile_ingredient_nutrient_value_nodes(
            info, node_ids, required
        )  # type: ignore


@strawberry.type
class ProfileIngredientConstraint(relay.Node):
    id: relay.NodeID[strawberry.ID]
    profile_id: relay.GlobalID
    ingredient_id: relay.GlobalID | None
    ingredient_category_id: relay.GlobalID | None
    type: IngredientConstraintType
    mode: IngredientConstraintMode
    operator: ConstraintOperator
    literal_unit_id: relay.GlobalID | None
    literal_value: float | None
    reference_ingredient_id: relay.GlobalID | None
    reference_ingredient_category_id: relay.GlobalID | None

    @strawberry.field
    async def ingredient(self, info: Info) -> Optional[Ingredient]:
        if self.ingredient_id is None:
            return None

        return await info.context.loaders.ingredient.load(
            int(self.ingredient_id.node_id)
        )

    @strawberry.field
    async def ingredient_category(self, info: Info) -> Optional[IngredientCategory]:
        if self.ingredient_category_id is None:
            return None

        return await info.context.loaders.ingredient_category.load(
            int(self.ingredient_category_id.node_id)
        )

    @strawberry.field
    async def literal_unit(self, info: Info) -> Optional[Unit]:
        if self.literal_unit_id is None:
            return None

        return await info.context.loaders.unit.load(self.literal_unit_id.node_id)

    @strawberry.field
    async def reference_ingredient(self, info: Info) -> Optional[Ingredient]:
        if self.reference_ingredient_id is None:
            return None

        return await info.context.loaders.ingredient.load(
            int(self.reference_ingredient_id.node_id)
        )

    @strawberry.field
    async def reference_ingredient_category(
        self, info: Info
    ) -> Optional[IngredientCategory]:
        if self.reference_ingredient_category_id is None:
            return None

        return await info.context.loaders.ingredient_category.load(
            int(self.reference_ingredient_category_id.node_id)
        )

    @staticmethod
    def from_model(
        constraint: models.ProfileIngredientConstraint,
    ) -> "ProfileIngredientConstraint":
        return ProfileIngredientConstraint(
            id=strawberry_id(constraint.id),
            profile_id=global_id(Profile, constraint.profile_id),
            ingredient_id=(
                global_id(Ingredient, constraint.ingredient_id)
                if constraint.ingredient_id is not None
                else None
            ),
            ingredient_category_id=(
                global_id(IngredientCategory, constraint.ingredient_category_id)
                if constraint.ingredient_category_id is not None
                else None
            ),
            type=IngredientConstraintType(constraint.type),
            mode=IngredientConstraintMode(constraint.mode),
            operator=ConstraintOperator(constraint.operator),
            literal_unit_id=(
                global_id(Unit, constraint.literal_unit_id)
                if constraint.literal_unit_id is not None
                else None
            ),
            literal_value=constraint.literal_value,
            reference_ingredient_id=(
                global_id(Ingredient, constraint.reference_ingredient_id)
                if constraint.reference_ingredient_id is not None
                else None
            ),
            reference_ingredient_category_id=(
                global_id(
                    IngredientCategory, constraint.reference_ingredient_category_id
                )
                if constraint.reference_ingredient_category_id is not None
                else None
            ),
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["ProfileIngredientConstraint"]:
        return await resolvers.profiles.resolve_profile_ingredient_constraint_nodes(
            info, node_ids, required
        )  # type: ignore


@strawberry.type
class ProfileNutrientConstraint(relay.Node):
    id: relay.NodeID[strawberry.ID]
    profile_id: relay.GlobalID
    nutrient_id: relay.GlobalID | None
    nutrient_category_id: relay.GlobalID | None
    type: NutrientConstraintType
    mode: NutrientConstraintMode
    operator: ConstraintOperator
    literal_unit_id: relay.GlobalID | None
    literal_value: float | None
    reference_nutrient_id: relay.GlobalID | None
    reference_nutrient_category_id: relay.GlobalID | None

    @strawberry.field
    async def nutrient(self, info: Info) -> Optional[Nutrient]:
        if self.nutrient_id is None:
            return None

        return await info.context.loaders.nutrient.load(int(self.nutrient_id.node_id))

    @strawberry.field
    async def nutrient_category(self, info: Info) -> Optional[NutrientCategory]:
        if self.nutrient_category_id is None:
            return None

        return await info.context.loaders.nutrient_category.load(
            int(self.nutrient_category_id.node_id)
        )

    @strawberry.field
    async def literal_unit(self, info: Info) -> Optional[Unit]:
        if self.literal_unit_id is None:
            return None

        return await info.context.loaders.unit.load(self.literal_unit_id.node_id)

    @strawberry.field
    async def reference_nutrient(self, info: Info) -> Optional[Nutrient]:
        if self.reference_nutrient_id is None:
            return None

        return await info.context.loaders.nutrient.load(
            int(self.reference_nutrient_id.node_id)
        )

    @strawberry.field
    async def reference_nutrient_category(
        self, info: Info
    ) -> Optional[NutrientCategory]:
        if self.reference_nutrient_category_id is None:
            return None

        return await info.context.loaders.nutrient_category.load(
            int(self.reference_nutrient_category_id.node_id)
        )

    @staticmethod
    def from_model(
        constraint: models.ProfileNutrientConstraint,
    ) -> "ProfileNutrientConstraint":
        return ProfileNutrientConstraint(
            id=strawberry_id(constraint.id),
            profile_id=global_id(Profile, constraint.profile_id),
            nutrient_id=(
                global_id(Nutrient, constraint.nutrient_id)
                if constraint.nutrient_id is not None
                else None
            ),
            nutrient_category_id=(
                global_id(NutrientCategory, constraint.nutrient_category_id)
                if constraint.nutrient_category_id is not None
                else None
            ),
            type=NutrientConstraintType(constraint.type),
            mode=NutrientConstraintMode(constraint.mode),
            operator=ConstraintOperator(constraint.operator),
            literal_unit_id=(
                global_id(Unit, constraint.literal_unit_id)
                if constraint.literal_unit_id is not None
                else None
            ),
            literal_value=constraint.literal_value,
            reference_nutrient_id=(
                global_id(Nutrient, constraint.reference_nutrient_id)
                if constraint.reference_nutrient_id is not None
                else None
            ),
            reference_nutrient_category_id=(
                global_id(NutrientCategory, constraint.reference_nutrient_category_id)
                if constraint.reference_nutrient_category_id is not None
                else None
            ),
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["ProfileNutrientConstraint"]:
        return await resolvers.profiles.resolve_profile_nutrient_constraint_nodes(
            info, node_ids, required
        )  # type: ignore


@strawberry.enum
class ProfileConstraintType(Enum):
    GROSS_ENERGY = "GROSS_ENERGY"
    DIGESTIBLE_ENERGY = "DIGESTIBLE_ENERGY"
    METABOLIZABLE_ENERGY = "METABOLIZABLE_ENERGY"
    NET_ENERGY = "NET_ENERGY"


@strawberry.enum
class ProfileConstraintMode(Enum):
    LITERAL = "LITERAL"


@strawberry.type
class ProfileConstraint(relay.Node):
    id: relay.NodeID[strawberry.ID]
    profile_id: relay.GlobalID
    type: ProfileConstraintType
    mode: ProfileConstraintMode
    operator: ConstraintOperator
    literal_unit_id: relay.GlobalID | None
    literal_value: float | None

    @strawberry.field
    async def literal_unit(self, info: Info) -> Optional[Unit]:
        if self.literal_unit_id is None:
            return None

        return await info.context.loaders.unit.load(self.literal_unit_id.node_id)

    @staticmethod
    def from_model(constraint: models.ProfileConstraint) -> "ProfileConstraint":
        return ProfileConstraint(
            id=strawberry_id(constraint.id),
            profile_id=global_id(Profile, constraint.profile_id),
            type=ProfileConstraintType(constraint.type),
            mode=ProfileConstraintMode(constraint.mode),
            operator=ConstraintOperator(constraint.operator),
            literal_unit_id=(
                global_id(Unit, constraint.literal_unit_id)
                if constraint.literal_unit_id is not None
                else None
            ),
            literal_value=constraint.literal_value,
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["ProfileConstraint"]:
        return await resolvers.profiles.resolve_profile_constraint_nodes(
            info, node_ids, required
        )  # type: ignore


@strawberry.type
class ProfileNutrientValue(relay.Node):
    id: relay.NodeID[strawberry.ID]
    profile_id: relay.GlobalID
    nutrient_id: relay.GlobalID
    gross_energy: float | None
    gross_energy_unit_id: relay.GlobalID | None
    digestible_energy: float | None
    digestible_energy_unit_id: relay.GlobalID | None
    metabolizable_energy: float | None
    metabolizable_energy_unit_id: relay.GlobalID | None
    net_energy: float | None
    net_energy_unit_id: relay.GlobalID | None

    @strawberry.field
    async def nutrient(self, info: Info) -> Nutrient:
        return await info.context.loaders.nutrient.load(int(self.nutrient_id.node_id))

    @strawberry.field
    async def gross_energy_unit(self, info: Info) -> Optional[Unit]:
        if self.gross_energy_unit_id is None:
            return None

        return await info.context.loaders.unit.load(self.gross_energy_unit_id.node_id)

    @strawberry.field
    async def digestible_energy_unit(self, info: Info) -> Optional[Unit]:
        if self.digestible_energy_unit_id is None:
            return None

        return await info.context.loaders.unit.load(
            self.digestible_energy_unit_id.node_id
        )

    @strawberry.field
    async def metabolizable_energy_unit(self, info: Info) -> Optional[Unit]:
        if self.metabolizable_energy_unit_id is None:
            return None

        return await info.context.loaders.unit.load(
            self.metabolizable_energy_unit_id.node_id
        )

    @strawberry.field
    async def net_energy_unit(self, info: Info) -> Optional[Unit]:
        if self.net_energy_unit_id is None:
            return None

        return await info.context.loaders.unit.load(self.net_energy_unit_id.node_id)

    @staticmethod
    def from_model(
        value: models.ProfileNutrientValue,
    ) -> "ProfileNutrientValue":
        return ProfileNutrientValue(
            id=strawberry_id(value.id),
            profile_id=global_id(Profile, value.profile_id),
            nutrient_id=global_id(Nutrient, value.nutrient_id),
            gross_energy=value.gross_energy,
            gross_energy_unit_id=(
                global_id(Unit, value.gross_energy_unit_id)
                if value.gross_energy_unit_id is not None
                else None
            ),
            digestible_energy=value.digestible_energy,
            digestible_energy_unit_id=(
                global_id(Unit, value.digestible_energy_unit_id)
                if value.digestible_energy_unit_id is not None
                else None
            ),
            metabolizable_energy=value.metabolizable_energy,
            metabolizable_energy_unit_id=(
                global_id(Unit, value.metabolizable_energy_unit_id)
                if value.metabolizable_energy_unit_id is not None
                else None
            ),
            net_energy=value.net_energy,
            net_energy_unit_id=(
                global_id(Unit, value.net_energy_unit_id)
                if value.net_energy_unit_id is not None
                else None
            ),
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["ProfileNutrientValue"]:
        return await resolvers.profiles.resolve_profile_nutrient_value_nodes(
            info, node_ids, required
        )  # type: ignore


@strawberry.enum
class IngredientCostMode(Enum):
    LITERAL = "LITERAL"


@strawberry.type
class ProfileIngredientCost(relay.Node):
    id: relay.NodeID[strawberry.ID]
    profile_id: relay.GlobalID
    ingredient_id: relay.GlobalID
    mode: IngredientCostMode
    literal_cost: float | None
    literal_cost_unit_id: relay.GlobalID | None

    @strawberry.field
    async def ingredient(self, info: Info) -> Ingredient:
        return await info.context.loaders.ingredient.load(
            int(self.ingredient_id.node_id)
        )

    @strawberry.field
    async def literal_cost_unit(self, info: Info) -> Optional[Unit]:
        if self.literal_cost_unit_id is None:
            return None

        return await info.context.loaders.unit.load(self.literal_cost_unit_id.node_id)

    @staticmethod
    def from_model(
        value: models.ProfileIngredientCost,
    ) -> "ProfileIngredientCost":
        return ProfileIngredientCost(
            id=strawberry_id(value.id),
            profile_id=global_id(Profile, value.profile_id),
            ingredient_id=global_id(Ingredient, value.ingredient_id),
            mode=IngredientCostMode(value.mode),
            literal_cost=value.literal_cost,
            literal_cost_unit_id=(
                global_id(Unit, value.literal_cost_unit_id)
                if value.literal_cost_unit_id is not None
                else None
            ),
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["ProfileIngredientCost"]:
        return await resolvers.profiles.resolve_profile_ingredient_cost_nodes(
            info, node_ids, required
        )  # type: ignore


@strawberry.type
class Profile(relay.Node):
    id: relay.NodeID[strawberry.ID]
    organization_id: str | None
    managed: bool
    name: str
    description: str | None

    @strawberry.field
    async def ingredient_constraints(
        self, info: Info
    ) -> list[ProfileIngredientConstraint]:
        return await resolvers.profiles.resolve_profile_ingredient_constraints(
            info,
            int(self.id),
        )

    @strawberry.field
    async def nutrient_constraints(self, info: Info) -> list[ProfileNutrientConstraint]:
        return await resolvers.profiles.resolve_profile_nutrient_constraints(
            info,
            int(self.id),
        )

    @strawberry.field
    async def ingredient_nutrient_values(
        self, info: Info
    ) -> list[ProfileIngredientNutrientValue]:
        return await resolvers.profiles.resolve_profile_ingredient_nutrient_values(
            info,
            int(self.id),
        )

    @strawberry.field
    async def nutrient_values(self, info: Info) -> list[ProfileNutrientValue]:
        return await resolvers.profiles.resolve_profile_nutrient_values(
            info,
            int(self.id),
        )

    @strawberry.field
    async def ingredient_costs(self, info: Info) -> list[ProfileIngredientCost]:
        return await resolvers.profiles.resolve_profile_ingredient_costs(
            info,
            int(self.id),
        )

    @strawberry.field
    async def constraints(self, info: Info) -> list[ProfileConstraint]:
        return await resolvers.profiles.resolve_profile_constraints(
            info,
            int(self.id),
        )

    @staticmethod
    def from_model(profile: models.Profile) -> "Profile":
        return Profile(
            id=strawberry_id(profile.id),
            organization_id=profile.organization_id,
            managed=profile.managed,
            name=profile.name,
            description=profile.description,
        )

    @classmethod
    async def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ) -> list["Profile"]:
        return await resolvers.profiles.resolve_profile_nodes(info, node_ids, required)  # type: ignore


@strawberry.input
class DeleteNodeInput:
    ids: list[relay.GlobalID]


@strawberry.type
class DeletedNode:
    success: bool


@strawberry.type
class UpdatedNutrientSettings:
    success: bool


@strawberry.input
class CreateNutrientCategoryInput:
    name: str
    description: str | None
    parent_nutrient_category_id: relay.GlobalID | None


@strawberry.input
class UpdateNutrientCategoryInput:
    id: relay.GlobalID
    name: str | None = strawberry.UNSET
    description: str | None = strawberry.UNSET
    parent_nutrient_category_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class CreateNutrientInput:
    nutrient_category_id: relay.GlobalID | None
    name: str
    description: str | None


@strawberry.input
class UpdateNutrientInput:
    id: relay.GlobalID
    nutrient_category_id: relay.GlobalID | None = strawberry.UNSET
    name: str | None = strawberry.UNSET
    description: str | None = strawberry.UNSET


@strawberry.input
class CreateIngredientCategoryInput:
    name: str
    description: str | None
    parent_ingredient_category_id: relay.GlobalID | None


@strawberry.input
class UpdateIngredientCategoryInput:
    id: relay.GlobalID
    name: str | None = strawberry.UNSET
    description: str | None = strawberry.UNSET
    parent_ingredient_category_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class IngredientNutrientInput:
    nutrient_id: relay.GlobalID


@strawberry.input
class CreateIngredientInput:
    ingredient_category_id: relay.GlobalID | None
    name: str
    description: str | None


@strawberry.input
class UpdateIngredientInput:
    id: relay.GlobalID
    ingredient_category_id: relay.GlobalID | None = strawberry.UNSET
    name: str | None = strawberry.UNSET
    description: str | None = strawberry.UNSET


@strawberry.input
class CreateProfileInput:
    name: str
    description: str | None


@strawberry.input
class UpdateProfileInput:
    id: relay.GlobalID
    name: str | None = strawberry.UNSET
    description: str | None = strawberry.UNSET


@strawberry.input
class CreateProfileConstraintInput:
    profile_id: relay.GlobalID
    type: ProfileConstraintType
    mode: ProfileConstraintMode
    operator: ConstraintOperator
    literal_unit_id: relay.GlobalID | None
    literal_value: float | None


@strawberry.input
class UpdateProfileConstraintInput:
    id: relay.GlobalID
    type: ProfileConstraintType | None = strawberry.UNSET
    mode: ProfileConstraintMode | None = strawberry.UNSET
    operator: ConstraintOperator | None = strawberry.UNSET
    literal_unit_id: relay.GlobalID | None = strawberry.UNSET
    literal_value: float | None = strawberry.UNSET


@strawberry.input
class CreateProfileIngredientConstraintInput:
    profile_id: relay.GlobalID
    ingredient_id: relay.GlobalID | None = strawberry.UNSET
    ingredient_category_id: relay.GlobalID | None = strawberry.UNSET
    type: IngredientConstraintType
    mode: IngredientConstraintMode
    operator: ConstraintOperator
    literal_unit_id: relay.GlobalID | None = strawberry.UNSET
    literal_value: float | None = strawberry.UNSET
    reference_ingredient_id: relay.GlobalID | None = strawberry.UNSET
    reference_ingredient_category_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class UpdateProfileIngredientConstraintInput:
    id: relay.GlobalID
    ingredient_id: relay.GlobalID | None = strawberry.UNSET
    ingredient_category_id: relay.GlobalID | None = strawberry.UNSET
    type: IngredientConstraintType | None = strawberry.UNSET
    mode: IngredientConstraintMode | None = strawberry.UNSET
    operator: ConstraintOperator | None = strawberry.UNSET
    literal_unit_id: relay.GlobalID | None = strawberry.UNSET
    literal_value: float | None = strawberry.UNSET
    reference_ingredient_id: relay.GlobalID | None = strawberry.UNSET
    reference_ingredient_category_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class CreateProfileNutrientConstraintInput:
    profile_id: relay.GlobalID
    nutrient_id: relay.GlobalID | None = strawberry.UNSET
    nutrient_category_id: relay.GlobalID | None = strawberry.UNSET
    type: NutrientConstraintType
    mode: NutrientConstraintMode
    operator: ConstraintOperator
    literal_unit_id: relay.GlobalID | None = strawberry.UNSET
    literal_value: float | None = strawberry.UNSET
    reference_nutrient_id: relay.GlobalID | None = strawberry.UNSET
    reference_nutrient_category_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class UpdateProfileNutrientConstraintInput:
    id: relay.GlobalID
    nutrient_id: relay.GlobalID | None = strawberry.UNSET
    nutrient_category_id: relay.GlobalID | None = strawberry.UNSET
    type: NutrientConstraintType | None = strawberry.UNSET
    mode: NutrientConstraintMode | None = strawberry.UNSET
    operator: ConstraintOperator | None = strawberry.UNSET
    literal_unit_id: relay.GlobalID | None = strawberry.UNSET
    literal_value: float | None = strawberry.UNSET
    reference_nutrient_id: relay.GlobalID | None = strawberry.UNSET
    reference_nutrient_category_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class CreateProfileIngredientNutrientValueInput:
    profile_id: relay.GlobalID
    ingredient_id: relay.GlobalID
    nutrient_id: relay.GlobalID
    value: float
    unit_id: relay.GlobalID


@strawberry.input
class UpdateProfileIngredientNutrientValueInput:
    id: relay.GlobalID
    ingredient_id: relay.GlobalID | None = strawberry.UNSET
    nutrient_id: relay.GlobalID | None = strawberry.UNSET
    value: float | None = strawberry.UNSET
    unit_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class CreateProfileNutrientValueInput:
    profile_id: relay.GlobalID
    nutrient_id: relay.GlobalID
    gross_energy: float | None = strawberry.UNSET
    gross_energy_unit_id: relay.GlobalID | None = strawberry.UNSET
    digestible_energy: float | None = strawberry.UNSET
    digestible_energy_unit_id: relay.GlobalID | None = strawberry.UNSET
    metabolizable_energy: float | None = strawberry.UNSET
    metabolizable_energy_unit_id: relay.GlobalID | None = strawberry.UNSET
    net_energy: float | None = strawberry.UNSET
    net_energy_unit_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class UpdateProfileNutrientValueInput:
    id: relay.GlobalID
    nutrient_id: relay.GlobalID | None = strawberry.UNSET
    gross_energy: float | None = strawberry.UNSET
    gross_energy_unit_id: relay.GlobalID | None = strawberry.UNSET
    digestible_energy: float | None = strawberry.UNSET
    digestible_energy_unit_id: relay.GlobalID | None = strawberry.UNSET
    metabolizable_energy: float | None = strawberry.UNSET
    metabolizable_energy_unit_id: relay.GlobalID | None = strawberry.UNSET
    net_energy: float | None = strawberry.UNSET
    net_energy_unit_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class CreateProfileIngredientCostInput:
    profile_id: relay.GlobalID
    ingredient_id: relay.GlobalID
    mode: IngredientCostMode
    literal_cost: float | None = strawberry.UNSET
    literal_cost_unit_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.input
class UpdateProfileIngredientCostInput:
    id: relay.GlobalID
    ingredient_id: relay.GlobalID | None = strawberry.UNSET
    mode: IngredientCostMode | None = strawberry.UNSET
    literal_cost: float | None = strawberry.UNSET
    literal_cost_unit_id: relay.GlobalID | None = strawberry.UNSET


@strawberry.type
class Query:
    node: relay.Node = relay.node()

    # nutrients
    nutrient_categories: list[NutrientCategory] = relay.connection(
        relay.ListConnection[NutrientCategory],
        resolver=resolvers.nutrient_categories.get_nutrient_categories,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    nutrients: list[Nutrient] = relay.connection(
        relay.ListConnection[Nutrient],
        resolver=resolvers.nutrients.get_nutrients,
        permission_classes=[IsAuthenticatedWithOrganization],
    )

    # ingredients
    ingredient_categories: list[IngredientCategory] = relay.connection(
        relay.ListConnection[IngredientCategory],
        resolver=resolvers.ingredient_categories.get_ingredient_categories,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    ingredients: list[Ingredient] = relay.connection(
        relay.ListConnection[Ingredient],
        resolver=resolvers.ingredients.get_ingredients,
        permission_classes=[IsAuthenticatedWithOrganization],
    )

    # profiles
    profiles: list[Profile] = relay.connection(
        relay.ListConnection[Profile],
        resolver=resolvers.profiles.get_profiles,
        permission_classes=[IsAuthenticatedWithOrganization],
    )

    # units
    units: list[Unit] = relay.connection(
        relay.ListConnection[Unit],
        resolver=resolvers.units.get_units,
        permission_classes=[IsAuthenticatedWithOrganization],
    )


@strawberry.type
class Mutation:
    # nutrients
    create_nutrient_category: NutrientCategory = strawberry.field(
        resolver=mutations.nutrient_categories.create_nutrient_category,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    create_nutrient: Nutrient = strawberry.field(
        resolver=mutations.nutrients.create_nutrient,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    update_nutrient_category: NutrientCategory = strawberry.field(
        resolver=mutations.nutrient_categories.update_nutrient_category,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    update_nutrient: Nutrient = strawberry.field(
        resolver=mutations.nutrients.update_nutrient,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_nutrient_category: DeletedNode = strawberry.field(
        resolver=mutations.nutrient_categories.delete_nutrient_category,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_nutrient: DeletedNode = strawberry.field(
        resolver=mutations.nutrients.delete_nutrient,
        permission_classes=[IsAuthenticatedWithOrganization],
    )

    # ingredients
    create_ingredient_category: IngredientCategory = strawberry.field(
        resolver=mutations.ingredient_categories.create_ingredient_category,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    create_ingredient: Ingredient = strawberry.field(
        resolver=mutations.ingredients.create_ingredient,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    update_ingredient_category: IngredientCategory = strawberry.field(
        resolver=mutations.ingredient_categories.update_ingredient_category,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    update_ingredient: Ingredient = strawberry.field(
        resolver=mutations.ingredients.update_ingredient,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_ingredient_category: DeletedNode = strawberry.field(
        resolver=mutations.ingredient_categories.delete_ingredient_category,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_ingredient: DeletedNode = strawberry.field(
        resolver=mutations.ingredients.delete_ingredient,
        permission_classes=[IsAuthenticatedWithOrganization],
    )

    # profiles
    create_profile: Profile = strawberry.field(
        resolver=mutations.profiles.create_profile,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    create_profile_constraint: ProfileConstraint = strawberry.field(
        resolver=mutations.profiles.create_profile_constraint,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    create_profile_ingredient_constraint: ProfileIngredientConstraint = (
        strawberry.field(
            resolver=mutations.profiles.create_profile_ingredient_constraint,
            permission_classes=[IsAuthenticatedWithOrganization],
        )
    )
    create_profile_nutrient_constraint: ProfileNutrientConstraint = strawberry.field(
        resolver=mutations.profiles.create_profile_nutrient_constraint,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    create_profile_ingredient_nutrient_value: ProfileIngredientNutrientValue = (
        strawberry.field(
            resolver=mutations.profiles.create_profile_ingredient_nutrient_value,
            permission_classes=[IsAuthenticatedWithOrganization],
        )
    )
    create_profile_nutrient_value: ProfileNutrientValue = strawberry.field(
        resolver=mutations.profiles.create_profile_nutrient_value,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    create_profile_ingredient_cost: ProfileIngredientCost = strawberry.field(
        resolver=mutations.profiles.create_profile_ingredient_cost,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    update_profile: Profile = strawberry.field(
        resolver=mutations.profiles.update_profile,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    update_profile_constraint: ProfileConstraint = strawberry.field(
        resolver=mutations.profiles.update_profile_constraint,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    update_profile_ingredient_constraint: ProfileIngredientConstraint = (
        strawberry.field(
            resolver=mutations.profiles.update_profile_ingredient_constraint,
            permission_classes=[IsAuthenticatedWithOrganization],
        )
    )
    update_profile_nutrient_constraint: ProfileNutrientConstraint = strawberry.field(
        resolver=mutations.profiles.update_profile_nutrient_constraint,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    update_profile_ingredient_nutrient_value: ProfileIngredientNutrientValue = (
        strawberry.field(
            resolver=mutations.profiles.update_profile_ingredient_nutrient_value,
            permission_classes=[IsAuthenticatedWithOrganization],
        )
    )
    update_profile_nutrient_value: ProfileNutrientValue = strawberry.field(
        resolver=mutations.profiles.update_profile_nutrient_value,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    update_profile_ingredient_cost: ProfileIngredientCost = strawberry.field(
        resolver=mutations.profiles.update_profile_ingredient_cost,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_profile: DeletedNode = strawberry.field(
        resolver=mutations.profiles.delete_profile,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_profile_constraint: DeletedNode = strawberry.field(
        resolver=mutations.profiles.delete_profile_constraint,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_profile_ingredient_constraint: DeletedNode = strawberry.field(
        resolver=mutations.profiles.delete_profile_ingredient_constraint,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_profile_nutrient_constraint: DeletedNode = strawberry.field(
        resolver=mutations.profiles.delete_profile_nutrient_constraint,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_profile_ingredient_nutrient_value: DeletedNode = strawberry.field(
        resolver=mutations.profiles.delete_profile_ingredient_nutrient_value,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_profile_nutrient_value: DeletedNode = strawberry.field(
        resolver=mutations.profiles.delete_profile_nutrient_value,
        permission_classes=[IsAuthenticatedWithOrganization],
    )
    delete_profile_ingredient_cost: DeletedNode = strawberry.field(
        resolver=mutations.profiles.delete_profile_ingredient_cost,
        permission_classes=[IsAuthenticatedWithOrganization],
    )


schema = strawberry.Schema(query=Query, mutation=Mutation)

graphql_app = strawberry.fastapi.GraphQLRouter(
    schema,
    context_getter=get_context,
)
