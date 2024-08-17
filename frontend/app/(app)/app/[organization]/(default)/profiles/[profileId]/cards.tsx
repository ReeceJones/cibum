import { Constraints } from "./constraints";
import { IngredientCosts } from "./ingredient-costs";
import { IngredientNutrientValues } from "./ingredient-nutrient-values";
import { IngredientRules } from "./ingredient-rules";
import { NutrientRules } from "./nutrient-rules";
import { NutrientValues } from "./nutrient-values";

export function ProfileCards() {
  return (
    <>
      <div className="col-span-3 flex flex-col space-y-8">
        <IngredientRules />
        <NutrientRules />
        <IngredientNutrientValues />
      </div>
      <div className="col-span-2 flex flex-col space-y-8">
        <Constraints />
        <IngredientCosts />
        <NutrientValues />
      </div>
    </>
  );
}
