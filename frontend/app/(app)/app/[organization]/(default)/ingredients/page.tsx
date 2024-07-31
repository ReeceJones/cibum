import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IngredientTable } from "./ingredient-table";

export default function NutritionPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>
            Manage the ingredients that are available to be used in diets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IngredientTable />
        </CardContent>
      </Card>
    </div>
  );
}
