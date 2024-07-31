from typing import Iterable, Optional

import strawberry
import strawberry.fastapi
from strawberry import relay

from app import models
from app.graphql import mutations, resolvers
from app.graphql.auth import IsAuthenticatedWithOrganization
from app.graphql.context import Info, get_context
from app.graphql.utils import global_id, strawberry_id


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
        return await resolvers.resolve_nutrient_nodes(info, node_ids, required)  # type: ignore


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
        return await resolvers.resolve_nutrient_category_nodes(info, node_ids, required)  # type: ignore


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


@strawberry.type
class Query:
    node: relay.Node = relay.node()

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


@strawberry.type
class Mutation:
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


schema = strawberry.Schema(query=Query, mutation=Mutation)

graphql_app = strawberry.fastapi.GraphQLRouter(
    schema,
    context_getter=get_context,
)
