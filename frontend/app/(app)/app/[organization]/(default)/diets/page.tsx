import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateDietDialog } from "./create-diet-dialog";
import { DietTable } from "./diet-table";

export default function DietsPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Diets</CardTitle>
          <CardDescription>
            Manage your organization&apos;s diets here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <CreateDietDialog />
            </div>
            <DietTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
