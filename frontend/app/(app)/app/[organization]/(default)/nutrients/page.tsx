import { PageHeading } from "@/components/ui/heading";
import { NutrientTable } from "./nutrient-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NutritionPage() {
  return (
    <div>
      {/* <PageHeading>Nutrients</PageHeading> */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrients</CardTitle>
          <CardDescription>
            Manage the nutrients that are available to be used in diets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NutrientTable />
        </CardContent>
      </Card>
    </div>
  );
}
