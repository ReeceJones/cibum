import logging
from collections import defaultdict
from typing import Any

from app import models
from app.graphql import schemas
from ortools.sat.python import cp_model
from pydantic import BaseModel
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

MAX_PRECISION = int(1e14)
FLOAT_SCALING_FACTOR = int(1e10)

VariablesType = dict[tuple[str, ...], cp_model.IntVar]


class NutrientEnergyValues(BaseModel):
    gross_energy: int | None
    digestible_energy: int | None
    metabolizable_energy: int | None
    net_energy: int | None


def _build_ingredient_variables(
    model: cp_model.CpModel, ingredients: list[models.Ingredient]
) -> VariablesType:
    variables: VariablesType = {}

    for ingredient in ingredients:
        key = ("ingredient", str(ingredient.id))
        variables[key] = model.NewIntVar(0, MAX_PRECISION, ".".join(key))

    return variables


def _build_ingredient_category_variables(
    model: cp_model.CpModel, ingredient_categories: list[models.IngredientCategory]
) -> VariablesType:
    variables: VariablesType = {}

    for ingredient_category in ingredient_categories:
        key = ("ingredient_category", str(ingredient_category.id))
        variables[key] = model.NewIntVar(0, MAX_PRECISION, ".".join(key))

    return variables


def _build_nutrient_variables(
    model: cp_model.CpModel, nutrients: list[models.Nutrient]
) -> VariablesType:
    variables: VariablesType = {}

    for nutrient in nutrients:
        key = ("nutrient", str(nutrient.id))
        variables[key] = model.NewIntVar(0, MAX_PRECISION, ".".join(key))

    return variables


def _build_nutrient_category_variables(
    model: cp_model.CpModel, nutrient_categories: list[models.NutrientCategory]
) -> VariablesType:
    variables: VariablesType = {}

    for nutrient_category in nutrient_categories:
        key = ("nutrient_category", str(nutrient_category.id))
        variables[key] = model.NewIntVar(0, MAX_PRECISION, ".".join(key))

    return variables


def _build_nutrient_energy_variables(
    model: cp_model.CpModel, nutrient_energy_values: dict[int, NutrientEnergyValues]
) -> VariablesType:
    variables: VariablesType = {}

    for nutrient_id in nutrient_energy_values.keys():
        for energy_type in ("gross", "digestible", "metabolizable", "net"):
            key = (f"nutrient_{energy_type}_energy", str(nutrient_id))
            variable = model.NewIntVar(0, MAX_PRECISION, ".".join(key))
            variables[key] = variable

    return variables


def _build_variables(
    model: cp_model.CpModel,
    ingredients: list[models.Ingredient],
    ingredient_categories: list[models.IngredientCategory],
    nutrients: list[models.Nutrient],
    nutrient_categories: list[models.NutrientCategory],
    nutrient_energy_values: dict[int, NutrientEnergyValues],
) -> VariablesType:
    return (
        _build_ingredient_variables(model, ingredients)
        | _build_ingredient_category_variables(
            model,
            ingredient_categories,
        )
        | _build_nutrient_variables(model, nutrients)
        | _build_nutrient_category_variables(model, nutrient_categories)
        | _build_nutrient_energy_variables(model, nutrient_energy_values)
    )


def _apply_operator(left: Any, op: str, right: Any) -> cp_model.BoundedLinearExpression:
    match schemas.ConstraintOperator(op):
        case schemas.ConstraintOperator.EQUAL:
            return left == right
        case schemas.ConstraintOperator.LESS_THAN:
            return left < right
        case schemas.ConstraintOperator.LESS_THAN_OR_EQUAL:
            return left <= right
        case schemas.ConstraintOperator.GREATER_THAN:
            return left > right
        case schemas.ConstraintOperator.GREATER_THAN_OR_EQUAL:
            return left >= right
        case schemas.ConstraintOperator.NOT_EQUAL:
            return left != right
        case _:
            raise ValueError(f"Unknown operator: {op}")


def _make_literal_value(
    value: float | None, unit: models.Unit | None, precision: int = MAX_PRECISION
) -> int:
    if value is None or unit is None:
        logging.info(f"Value: {value}, Unit: {unit}")
        raise ValueError("Value and unit must be provided")

    logging.info(
        f"Value: {value}, Unit Multiplier: {unit.base_unit_multiplier}, Precision: {precision}"
    )

    # convert value to base unit then scale to an integral value
    return int(
        (value * unit.base_unit_multiplier + unit.base_unit_offset)
        * FLOAT_SCALING_FACTOR
    )


def _build_ingredient_constraints(
    model: cp_model.CpModel,
    variables: VariablesType,
    profile: models.Profile,
) -> None:
    for ingredient_constraint in profile.profile_ingredient_constraints:
        if ingredient_constraint.archived:
            continue

        variable_key = (
            ("ingredient", str(ingredient_constraint.ingredient_id))
            if schemas.IngredientConstraintType(ingredient_constraint.type)
            == schemas.IngredientConstraintType.INGREDIENT
            else (
                "ingredient_category",
                str(ingredient_constraint.ingredient_category_id),
            )
        )
        reference_value = (
            _make_literal_value(
                ingredient_constraint.literal_value,
                ingredient_constraint.literal_unit,
            )
            if schemas.IngredientConstraintMode(ingredient_constraint.mode)
            == schemas.IngredientConstraintMode.LITERAL
            else variables[
                (
                    (
                        "ingredient",
                        str(ingredient_constraint.reference_ingredient_id),
                    )
                    if schemas.IngredientConstraintType(ingredient_constraint.type)
                    == schemas.IngredientConstraintType.INGREDIENT
                    else (
                        "ingredient_category",
                        str(ingredient_constraint.reference_ingredient_category_id),
                    )
                )
            ]
        )
        model.Add(
            _apply_operator(
                variables[variable_key],
                ingredient_constraint.operator,
                reference_value,
            )
        )


def _build_nutrient_constraints(
    model: cp_model.CpModel,
    variables: VariablesType,
    profile: models.Profile,
) -> None:
    for nutrient_constraint in profile.profile_nutrient_constraints:
        if nutrient_constraint.archived:
            continue

        variable_key = (
            ("nutrient", str(nutrient_constraint.nutrient_id))
            if schemas.NutrientConstraintType(nutrient_constraint.type)
            == schemas.NutrientConstraintType.NUTRIENT
            else (
                "nutrient_category",
                str(nutrient_constraint.nutrient_category_id),
            )
        )
        reference_value = (
            _make_literal_value(
                nutrient_constraint.literal_value,
                nutrient_constraint.literal_unit,
            )
            if schemas.NutrientConstraintMode(nutrient_constraint.mode)
            == schemas.NutrientConstraintMode.LITERAL
            else variables[
                (
                    (
                        "nutrient",
                        str(nutrient_constraint.reference_nutrient_id),
                    )
                    if schemas.NutrientConstraintType(nutrient_constraint.type)
                    == schemas.NutrientConstraintType.NUTRIENT
                    else (
                        "nutrient_category",
                        str(nutrient_constraint.reference_nutrient_category_id),
                    )
                )
            ]
        )

        model.Add(
            _apply_operator(
                variables[variable_key],
                nutrient_constraint.operator,
                reference_value,
            )
        )


def _build_profile_constraints(
    model: cp_model.CpModel,
    variables: VariablesType,
    profile: models.Profile,
) -> None:
    for profile_constraint in profile.profile_constraints:
        if profile_constraint.archived:
            continue

        match schemas.ProfileConstraintType(profile_constraint.type):
            case schemas.ProfileConstraintType.GROSS_ENERGY:
                constraint = _apply_operator(
                    cp_model.LinearExpr.Sum(
                        [
                            v
                            for k, v in variables.items()
                            if k[0] == "nutrient_gross_energy"
                        ]
                    ),
                    profile_constraint.operator,
                    _make_literal_value(
                        profile_constraint.literal_value,
                        profile_constraint.literal_unit,
                    ),
                )
            case schemas.ProfileConstraintType.DIGESTIBLE_ENERGY:
                constraint = _apply_operator(
                    cp_model.LinearExpr.Sum(
                        [
                            v
                            for k, v in variables.items()
                            if k[0] == "nutrient_digestible_energy"
                        ]
                    ),
                    profile_constraint.operator,
                    _make_literal_value(
                        profile_constraint.literal_value,
                        profile_constraint.literal_unit,
                    ),
                )
            case schemas.ProfileConstraintType.METABOLIZABLE_ENERGY:
                constraint = _apply_operator(
                    cp_model.LinearExpr.Sum(
                        [
                            v
                            for k, v in variables.items()
                            if k[0] == "nutrient_metabolizable_energy"
                        ]
                    ),
                    profile_constraint.operator,
                    _make_literal_value(
                        profile_constraint.literal_value,
                        profile_constraint.literal_unit,
                    ),
                )
            case schemas.ProfileConstraintType.NET_ENERGY:
                constraint = _apply_operator(
                    cp_model.LinearExpr.Sum(
                        [
                            v
                            for k, v in variables.items()
                            if k[0] == "nutrient_net_energy"
                        ]
                    ),
                    profile_constraint.operator,
                    _make_literal_value(
                        profile_constraint.literal_value,
                        profile_constraint.literal_unit,
                    ),
                )

        model.Add(constraint)


def _build_ingredient_weight_constraints(
    model: cp_model.CpModel, variables: VariablesType
) -> None:
    constraint = (
        cp_model.LinearExpr.Sum(
            [v for k, v in variables.items() if k[0] == "ingredient"]
        )
        == FLOAT_SCALING_FACTOR
    )
    model.Add(constraint)


def _build_category_binding_constraints(
    model: cp_model.CpModel,
    variables: VariablesType,
    ingredients: list[models.Ingredient],
    nutrients: list[models.Nutrient],
) -> None:
    child_id_map = defaultdict(set)
    for ingredient in ingredients:
        if ingredient.ingredient_category_id is None:
            continue

        child_id_map[
            ("ingredient_category", str(ingredient.ingredient_category_id))
        ].add(("ingredient", str(ingredient.id)))

    for nutrient in nutrients:
        if nutrient.nutrient_category_id is None:
            continue

        child_id_map[("nutrient_category", str(nutrient.nutrient_category_id))].add(
            ("nutrient", str(nutrient.id))
        )

    for scope in ("ingredient", "nutrient"):
        category_name = f"{scope}_category"
        for category_id in {k[1] for k in variables if k[0] == category_name}:
            var = variables[(category_name, category_id)]
            child_ids = child_id_map.get((category_name, category_id), set())
            sub_vars = [
                v for k, v in variables.items() if k[0] == scope and k[1] in child_ids
            ]
            # category must be sum of all its children
            model.Add(cp_model.LinearExpr.Sum(sub_vars) == var)


def _build_ingredient_composition_constraints(
    model: cp_model.CpModel,
    variables: VariablesType,
    ingredient_compositions: dict[int, dict[int, int]],
) -> None:
    for ingredient_id, composition in ingredient_compositions.items():
        for nutrient_id, value in composition.items():
            ingredient_key = ("ingredient", str(ingredient_id))
            nutrient_key = ("nutrient", str(nutrient_id))
            concentration = value / FLOAT_SCALING_FACTOR
            model.Add(
                variables[ingredient_key] * concentration == variables[nutrient_key]
            )


def _build_ingredient_energy_constraints(
    model: cp_model.CpModel,
    variables: VariablesType,
    nutrient_energy_values: dict[int, NutrientEnergyValues],
) -> None:
    for nutrient_id, energy_values in nutrient_energy_values.items():
        for energy_type in ("gross", "digestible", "metabolizable", "net"):
            key = (f"nutrient_{energy_type}_energy", str(nutrient_id))
            variable = variables[key]

            value = getattr(energy_values, energy_type + "_energy")

            if value is None:
                continue

            model.Add(variable == value)
            model.AddHint(variable, value)


def _build_constraints(
    model: cp_model.CpModel,
    variables: VariablesType,
    selected_profiles: list[models.DietProfileConfiguration],
    ingredients: list[models.Ingredient],
    nutrients: list[models.Nutrient],
    nutrient_energy_values: dict[int, NutrientEnergyValues],
    ingredient_compositions: dict[int, dict[int, int]],
) -> None:
    # global constraints
    _build_ingredient_weight_constraints(model, variables)
    _build_category_binding_constraints(model, variables, ingredients, nutrients)
    _build_ingredient_composition_constraints(model, variables, ingredient_compositions)
    _build_ingredient_energy_constraints(model, variables, nutrient_energy_values)

    # profile constraints
    for profile_configuration in selected_profiles:
        _build_ingredient_constraints(model, variables, profile_configuration.profile)
        _build_nutrient_constraints(model, variables, profile_configuration.profile)
        _build_profile_constraints(model, variables, profile_configuration.profile)


def _build_objective(
    model: cp_model.CpModel,
    variables: VariablesType,
    ingredient_costs: dict[int, int],
) -> None:
    # minimize cost
    # probably room for other objectives here like: maximize protein, minimize carbs, etc.
    # could even add these as secondary objectives with weights

    model.Minimize(
        cp_model.LinearExpr.WeightedSum(
            [variables[k] for k in variables.keys() if k[0] == "ingredient"],
            [
                float(ingredient_costs.get(int(k[1]), 0) / FLOAT_SCALING_FACTOR)
                for k in variables.keys()
                if k[0] == "ingredient"
            ],
        )
    )


async def _get_selected_profiles(
    db: AsyncSession, diet: models.Diet
) -> list[models.DietProfileConfiguration]:
    return list(
        await db.scalars(
            select(models.DietProfileConfiguration)
            .where(
                models.DietProfileConfiguration.diet_id == diet.id,
                models.DietProfileConfiguration.configuration_version
                == select(func.max(models.DietConfigurationVersion.version))
                .where(models.DietConfigurationVersion.diet_id == diet.id)
                .scalar_subquery(),
                models.DietProfileConfiguration.archived == False,
            )
            .order_by(models.DietProfileConfiguration.order)
            .options(
                selectinload(models.DietProfileConfiguration.profile).options(
                    selectinload(
                        models.Profile.profile_ingredient_constraints,
                    ).options(
                        selectinload(
                            models.ProfileIngredientConstraint.literal_unit,
                        )
                    ),
                    selectinload(
                        models.Profile.profile_nutrient_constraints,
                    ).options(
                        selectinload(
                            models.ProfileNutrientConstraint.literal_unit,
                        )
                    ),
                    selectinload(models.Profile.profile_constraints).options(
                        selectinload(
                            models.ProfileConstraint.literal_unit,
                        )
                    ),
                    selectinload(
                        models.Profile.profile_ingredient_nutrient_values
                    ).options(
                        selectinload(
                            models.ProfileIngredientNutrientValue.unit,
                        )
                    ),
                    selectinload(models.Profile.profile_ingredient_costs).options(
                        selectinload(
                            models.ProfileIngredientCost.literal_cost_unit,
                        )
                    ),
                    selectinload(models.Profile.profile_nutrient_values).options(
                        selectinload(models.ProfileNutrientValue.gross_energy_unit),
                        selectinload(
                            models.ProfileNutrientValue.digestible_energy_unit
                        ),
                        selectinload(
                            models.ProfileNutrientValue.metabolizable_energy_unit
                        ),
                        selectinload(models.ProfileNutrientValue.net_energy_unit),
                    ),
                ),
            )
        )
    )


async def _get_ingredients(
    db: AsyncSession, diet: models.Diet
) -> tuple[list[models.Ingredient], list[models.IngredientCategory]]:
    ingredients = await db.scalars(
        select(models.Ingredient).where(
            or_(
                models.Ingredient.organization_id == diet.organization_id,
                models.Ingredient.organization_id == None,
            ),
            models.Ingredient.archived == False,
        )
    )

    ingredient_categories = await db.scalars(
        select(models.IngredientCategory).where(
            or_(
                models.IngredientCategory.organization_id == diet.organization_id,
                models.IngredientCategory.organization_id == None,
            ),
            models.IngredientCategory.archived == False,
        )
    )

    return list(ingredients), list(ingredient_categories)


async def _get_nutrients(
    db: AsyncSession, diet: models.Diet
) -> tuple[list[models.Nutrient], list[models.NutrientCategory]]:
    nutrients = await db.scalars(
        select(models.Nutrient).where(
            or_(
                models.Nutrient.organization_id == diet.organization_id,
                models.Nutrient.organization_id == None,
            ),
            models.Nutrient.archived == False,
        )
    )

    nutrient_categories = await db.scalars(
        select(models.NutrientCategory).where(
            or_(
                models.NutrientCategory.organization_id == diet.organization_id,
                models.NutrientCategory.organization_id == None,
            ),
            models.NutrientCategory.archived == False,
        )
    )

    return list(nutrients), list(nutrient_categories)


def _build_ingredient_costs(
    selected_profiles: list[models.DietProfileConfiguration],
) -> dict[int, int]:
    ingredient_costs = {}
    for profile_configuration in selected_profiles:
        for ingredient_cost in profile_configuration.profile.profile_ingredient_costs:
            if (
                ingredient_cost.archived
                or ingredient_cost.ingredient_id in ingredient_costs
            ):
                continue

            ingredient_costs[ingredient_cost.ingredient_id] = _make_literal_value(
                ingredient_cost.literal_cost, ingredient_cost.literal_cost_unit
            )

    return ingredient_costs


def _build_nutrient_energy_values(
    selected_profiles: list[models.DietProfileConfiguration],
) -> dict[int, NutrientEnergyValues]:
    nutrient_energy_values = {}
    for profile_configuration in selected_profiles:
        for nutrient_energy in profile_configuration.profile.profile_nutrient_values:
            if (
                nutrient_energy.archived
                or nutrient_energy.nutrient_id in nutrient_energy_values
            ):
                continue

            nutrient_energy_values[nutrient_energy.nutrient_id] = NutrientEnergyValues(
                gross_energy=(
                    _make_literal_value(
                        nutrient_energy.gross_energy, nutrient_energy.gross_energy_unit
                    )
                    if nutrient_energy.gross_energy is not None
                    else None
                ),
                digestible_energy=(
                    _make_literal_value(
                        nutrient_energy.digestible_energy,
                        nutrient_energy.digestible_energy_unit,
                    )
                    if nutrient_energy.digestible_energy is not None
                    else None
                ),
                metabolizable_energy=(
                    _make_literal_value(
                        nutrient_energy.metabolizable_energy,
                        nutrient_energy.metabolizable_energy_unit,
                    )
                    if nutrient_energy.metabolizable_energy is not None
                    else None
                ),
                net_energy=(
                    _make_literal_value(
                        nutrient_energy.net_energy, nutrient_energy.net_energy_unit
                    )
                    if nutrient_energy.net_energy is not None
                    else None
                ),
            )

    return nutrient_energy_values


def _build_ingredient_compositions(
    selected_profiles: list[models.DietProfileConfiguration],
) -> dict[int, dict[int, int]]:
    ingredient_compositions = defaultdict(dict)
    for profile_configuration in selected_profiles:
        for (
            ingredient_nutrient_value
        ) in profile_configuration.profile.profile_ingredient_nutrient_values:
            if (
                ingredient_nutrient_value.archived
                or ingredient_nutrient_value.nutrient_id
                in ingredient_compositions[ingredient_nutrient_value.ingredient_id]
            ):
                continue

            ingredient_compositions[ingredient_nutrient_value.ingredient_id][
                ingredient_nutrient_value.nutrient_id
            ] = _make_literal_value(
                ingredient_nutrient_value.value, ingredient_nutrient_value.unit
            )

    return ingredient_compositions


async def _get_units(db: AsyncSession) -> dict[str, models.Unit]:
    units = await db.scalars(select(models.Unit))
    return {unit.id: unit for unit in units}


def _make_ingredient_output(
    diet: models.Diet,
    version: int,
    ingredient_id: int,
    scaled_amount: int,
    amount_unit_id: str,
    energy_unit_id: str,
    cost_unit_id: str,
    amount_unit: models.Unit,
    cost_unit: models.Unit,
    ingredient_costs: dict[int, int],
    ingredient_nutrient_outputs: list[models.DietIngredientNutrientOutput],
) -> models.DietIngredientOutput:
    base_unit_amount = scaled_amount / FLOAT_SCALING_FACTOR
    amount = (
        base_unit_amount - amount_unit.base_unit_offset
    ) / amount_unit.base_unit_multiplier
    base_unit_cost = ingredient_costs.get(ingredient_id, 0) / FLOAT_SCALING_FACTOR
    cost = (
        base_unit_cost - cost_unit.base_unit_offset
    ) / cost_unit.base_unit_multiplier

    diet_ingredient_output = models.DietIngredientOutput(
        diet_id=diet.id,
        ingredient_id=ingredient_id,
        version=version,
        amount=amount,
        amount_unit_id=amount_unit_id,
        cost=cost,
        cost_unit_id=cost_unit_id,
        gross_energy=sum(
            nutrient_output.gross_energy or 0
            for nutrient_output in ingredient_nutrient_outputs
        ),
        gross_energy_unit_id=energy_unit_id,
        digestible_energy=sum(
            nutrient_output.digestible_energy or 0
            for nutrient_output in ingredient_nutrient_outputs
        ),
        digestible_energy_unit_id=energy_unit_id,
        metabolizable_energy=sum(
            nutrient_output.metabolizable_energy or 0
            for nutrient_output in ingredient_nutrient_outputs
        ),
        metabolizable_energy_unit_id=energy_unit_id,
        net_energy=sum(
            nutrient_output.net_energy or 0
            for nutrient_output in ingredient_nutrient_outputs
        ),
        net_energy_unit_id=energy_unit_id,
    )

    return diet_ingredient_output


def _make_ingredient_nutrient_outputs(
    diet: models.Diet,
    version: int,
    ingredient_id: int,
    scaled_amount: int,
    amount_unit: models.Unit,
    energy_unit: models.Unit,
    nutrient_energy_values: dict[int, NutrientEnergyValues],
    ingredient_compositions: dict[int, dict[int, int]],
) -> list[models.DietIngredientNutrientOutput]:
    ingredient_nutrient_outputs = []
    ingredient_compositions.get(ingredient_id, {})
    for nutrient_id, concentration in ingredient_compositions.get(
        ingredient_id, {}
    ).items():
        nutrient_energy_value = nutrient_energy_values.get(nutrient_id)
        if nutrient_energy_value is None:
            continue

        base_unit_amount = (scaled_amount / FLOAT_SCALING_FACTOR) * (
            concentration / FLOAT_SCALING_FACTOR
        )

        gross_energy = (
            (
                (
                    (
                        (nutrient_energy_value.gross_energy / FLOAT_SCALING_FACTOR)
                        - energy_unit.base_unit_offset
                    )
                    / energy_unit.base_unit_multiplier
                )
                * base_unit_amount
            )
            if nutrient_energy_value.gross_energy is not None
            else None
        )
        digestible_energy = (
            (
                (
                    (
                        (nutrient_energy_value.digestible_energy / FLOAT_SCALING_FACTOR)
                        - energy_unit.base_unit_offset
                    )
                    / energy_unit.base_unit_multiplier
                )
                * base_unit_amount
            )
            if nutrient_energy_value.digestible_energy is not None
            else None
        )
        metabolizable_energy = (
            (
                (
                    (
                        (
                            nutrient_energy_value.metabolizable_energy
                            / FLOAT_SCALING_FACTOR
                        )
                        - energy_unit.base_unit_offset
                    )
                    / energy_unit.base_unit_multiplier
                )
                * base_unit_amount
            )
            if nutrient_energy_value.metabolizable_energy is not None
            else None
        )
        net_energy = (
            (
                (
                    (
                        (nutrient_energy_value.net_energy / FLOAT_SCALING_FACTOR)
                        - energy_unit.base_unit_offset
                    )
                    / energy_unit.base_unit_multiplier
                )
                * base_unit_amount
            )
            if nutrient_energy_value.net_energy is not None
            else None
        )

        amount = (
            base_unit_amount - amount_unit.base_unit_offset
        ) / amount_unit.base_unit_multiplier

        diet_ingredient_nutrient_output = models.DietIngredientNutrientOutput(
            diet_id=diet.id,
            ingredient_id=ingredient_id,
            nutrient_id=nutrient_id,
            version=version,
            gross_energy=gross_energy,
            gross_energy_unit_id=energy_unit.id,
            digestible_energy=digestible_energy,
            digestible_energy_unit_id=energy_unit.id,
            metabolizable_energy=metabolizable_energy,
            metabolizable_energy_unit_id=energy_unit.id,
            net_energy=net_energy,
            net_energy_unit_id=energy_unit.id,
            amount=amount,
            amount_unit_id=amount_unit.id,
        )

        ingredient_nutrient_outputs.append(diet_ingredient_nutrient_output)

    return ingredient_nutrient_outputs


async def _decode_solution(
    db: AsyncSession,
    diet: models.Diet,
    status: "schemas.DietOutputStatus",
    selected_ingredients: dict[int, int],
    units: dict[str, models.Unit],
    ingredient_costs: dict[int, int],
) -> models.DietOutputVersion:
    version = (
        await db.scalar(
            select(func.max(models.DietOutputVersion.version)).where(
                models.DietOutputVersion.diet_id == diet.id
            )
        )
        or 0
    ) + 1
    diet_output_version = models.DietOutputVersion(
        diet_id=diet.id,
        status=status.value,
        version=version,
    )
    db.add(diet_output_version)

    if status not in (
        schemas.DietOutputStatus.OPTIMAL,
        schemas.DietOutputStatus.FEASIBLE,
    ):
        return diet_output_version

    amount_unit_id = "%"
    cost_unit_id = "$-kg"
    energy_unit_id = "mj-kg"
    amount_unit = units[amount_unit_id]
    cost_unit = units[cost_unit_id]
    energy_unit = units[energy_unit_id]

    total_cost = 0
    total_gross_energy = 0
    total_digestible_energy = 0
    total_metabolizable_energy = 0
    total_net_energy = 0

    for ingredient_id, scaled_amount in selected_ingredients.items():
        ingredient_nutrient_outputs = _make_ingredient_nutrient_outputs(
            diet=diet,
            version=version,
            ingredient_id=ingredient_id,
            scaled_amount=scaled_amount,
            amount_unit=amount_unit,
            energy_unit=energy_unit,
            nutrient_energy_values={},
            ingredient_compositions={},
        )
        for nutrient_output in ingredient_nutrient_outputs:
            db.add(nutrient_output)
            total_gross_energy += nutrient_output.gross_energy or 0
            total_digestible_energy += nutrient_output.digestible_energy or 0
            total_metabolizable_energy += nutrient_output.metabolizable_energy or 0
            total_net_energy += nutrient_output.net_energy or 0

        ingredient_output = _make_ingredient_output(
            diet=diet,
            version=version,
            ingredient_id=ingredient_id,
            scaled_amount=scaled_amount,
            amount_unit_id=amount_unit_id,
            energy_unit_id=energy_unit_id,
            cost_unit_id=cost_unit_id,
            amount_unit=amount_unit,
            cost_unit=cost_unit,
            ingredient_costs=ingredient_costs,
            ingredient_nutrient_outputs=ingredient_nutrient_outputs,
        )
        db.add(ingredient_output)

        total_cost += ingredient_output.cost or 0

    # TODO: the values stored in here need to be a weighted sum of the selected ingredients
    diet_summary_output = models.DietSummaryOutput(
        diet_id=diet.id,
        version=version,
        cost=total_cost,
        cost_unit_id=cost_unit_id,
        gross_energy=total_gross_energy,
        gross_energy_unit_id=energy_unit_id,
        digestible_energy=total_digestible_energy,
        digestible_energy_unit_id=energy_unit_id,
        metabolizable_energy=total_metabolizable_energy,
        metabolizable_energy_unit_id=energy_unit_id,
        net_energy=total_net_energy,
        net_energy_unit_id=energy_unit_id,
    )
    db.add(diet_summary_output)

    return diet_output_version


async def generate_diet(
    db: AsyncSession, diet: models.Diet
) -> models.DietOutputVersion:
    # get data
    selected_profiles = await _get_selected_profiles(db, diet)
    ingredients, ingredient_categories = await _get_ingredients(db, diet)
    nutrients, nutrient_categories = await _get_nutrients(db, diet)
    units = await _get_units(db)
    ingredient_costs = _build_ingredient_costs(selected_profiles)
    nutrient_energy_values = _build_nutrient_energy_values(selected_profiles)
    ingredient_compositions = _build_ingredient_compositions(selected_profiles)

    # apply constraints
    model = cp_model.CpModel()

    # setup variables
    variables = _build_variables(
        model,
        ingredients=ingredients,
        ingredient_categories=ingredient_categories,
        nutrients=nutrients,
        nutrient_categories=nutrient_categories,
        nutrient_energy_values=nutrient_energy_values,
    )

    # setup constraints
    _build_constraints(
        model,
        variables=variables,
        selected_profiles=selected_profiles,
        ingredients=ingredients,
        nutrients=nutrients,
        nutrient_energy_values=nutrient_energy_values,
        ingredient_compositions=ingredient_compositions,
    )

    # setup objective function
    _build_objective(model, variables, ingredient_costs=ingredient_costs)

    # get the optimized diet
    solver = cp_model.CpSolver()
    # solver.parameters.log_search_progress = True
    solver.parameters.max_time_in_seconds = 60
    solver_status = solver.Solve(model)

    match solver_status:
        case cp_model.UNKNOWN:
            status = schemas.DietOutputStatus.UNKNOWN
        case cp_model.MODEL_INVALID:
            status = schemas.DietOutputStatus.MODEL_INVALID
        case cp_model.INFEASIBLE:
            status = schemas.DietOutputStatus.INFEASIBLE
        case cp_model.OPTIMAL:
            status = schemas.DietOutputStatus.OPTIMAL
        case cp_model.FEASIBLE:
            status = schemas.DietOutputStatus.FEASIBLE
        case _:
            raise Exception(f"Unknown solver status: {solver_status}")

    logging.info(f"Solver Status: {status}")

    if status in (
        schemas.DietOutputStatus.UNKNOWN,
        schemas.DietOutputStatus.MODEL_INVALID,
        schemas.DietOutputStatus.INFEASIBLE,
    ):
        return await _decode_solution(
            db,
            diet=diet,
            status=status,
            selected_ingredients={},
            units=units,
            ingredient_costs=ingredient_costs,
        )

    # decode solution
    selected_ingredients = {}
    for key, variable in variables.items():
        if key[0] == "ingredient" and solver.Value(variable) > 0:
            selected_ingredients[int(key[1])] = solver.Value(variable)

    descaled_selected_ingredients = {
        ingredient_id: amount / FLOAT_SCALING_FACTOR
        for ingredient_id, amount in selected_ingredients.items()
    }

    logging.info(f"Selected Ingredients: {selected_ingredients}")
    logging.info(f"Descaled Selected Ingredients: {descaled_selected_ingredients}")

    return await _decode_solution(
        db,
        diet=diet,
        status=status,
        selected_ingredients=selected_ingredients,
        units=units,
        ingredient_costs=ingredient_costs,
    )
