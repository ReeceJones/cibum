import { Constraints } from "./constraints";
import { IngredientCosts } from "./ingredient-costs";
import { IngredientNutrientValues } from "./ingredient-nutrient-values";
import { IngredientRules } from "./ingredient-rules";
import { NutrientRules } from "./nutrient-rules";
import { NutrientValues } from "./nutrient-values";

export function ProfileCards() {
  return (
    <>
      <div className="col-span-3">
        <IngredientRules />
      </div>
      <div className="col-span-2 row-span-3 flex-row space-y-8">
        <Constraints />
        <IngredientCosts />
        <NutrientValues />
      </div>
      <div className="col-span-3">
        <NutrientRules />
      </div>
      <div className="col-span-3">
        <IngredientNutrientValues />
      </div>
    </>
  );
}
