import { CompositionRules } from "./composition-rules";
import { Constraints } from "./constraints";
import { IngredientNutrientValues } from "./ingredient-nutrient-values";
import { IngredientRules } from "./ingredient-rules";
import { NutrientRules } from "./nutrient-rules";

export function ProfileCards() {
  return (
    <>
      <div className="col-span-3">
        <IngredientRules />
      </div>
      <div className="col-span-2 row-span-2 flex-row space-y-8">
        <Constraints />
        <CompositionRules />
      </div>
      <div className="col-span-3">
        <NutrientRules />
      </div>
      <div className="col-span-5">
        <IngredientNutrientValues />
      </div>
    </>
  );
}
