import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGraphQLMutation } from "@/lib/graphql";
import { generateDietOutputMutaiton } from "@/lib/mutations/generate-diet-output";
import { IconRepeat } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useDiet } from "./use-diet";
import { toast } from "sonner";
import { DietOutputVersion } from "@/lib/gql/graphql";
import { ReactGrid, Column, Row } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useEffect, useState } from "react";

const ingredientColumns: Column[] = [
  {
    columnId: "name",
    width: 200,
  },
  {
    columnId: "amount",
    width: 100,
  },
  {
    columnId: "cost",
    width: 100,
  },
];

const headerRow: Row = {
  rowId: "header",
  cells: [
    { type: "header", text: "Name", nonEditable: true },
    { type: "header", text: "Amount", nonEditable: true },
    { type: "header", text: "Cost", nonEditable: true },
  ],
};

function getIngredientRows(
  ingredientOutputs: DietOutputVersion["ingredientOutputs"]
): Row[] {
  return ingredientOutputs.map((ingredient) => ({
    rowId: ingredient.id,
    cells: [
      { type: "text", text: ingredient.ingredient.name, nonEditable: true },
      {
        type: "text",
        text: ingredient.amount.toString() + ingredient.amountUnit.symbol,
        nonEditable: true,
      },
      {
        type: "text",
        text:
          (ingredient.cost?.toString() ?? "") + ingredient.costUnit?.symbol ??
          "",
        nonEditable: true,
      },
    ],
  }));
}

export function Output() {
  const { diet, output, setOutput } = useDiet();
  const [rows, setRows] = useState<Row[]>([]);
  const generateDietOutput = useGraphQLMutation(generateDietOutputMutaiton);
  const mutation = useMutation({
    ...generateDietOutput,
    onSuccess: (data) => {
      toast.success("Diet regenerated successfully.");
      console.log(data);
      setOutput(data.generateDietOutput as DietOutputVersion);
    },
    onError: (error) => {
      toast.error("Failed to regenerate diet.");
    },
  });

  useEffect(() => {
    if (output) {
      setRows([headerRow, ...getIngredientRows(output.ingredientOutputs)]);
    }
  }, [output]);

  async function handleRegenerate() {
    await mutation.mutateAsync({
      input: {
        dietId: diet.id,
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-2 justify-between items-start">
          <div className="space-y-1">
            <CardTitle>Diet</CardTitle>
            <CardDescription>The final constructed diet.</CardDescription>
          </div>
          <div>
            <Button
              size="sm"
              className="flex items-center space-x-2"
              loading={mutation.isPending}
              onClick={handleRegenerate}
            >
              <IconRepeat size={16} />
              <span>Regenerate</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>{output?.status}</div>
        <div className="w-full">
          <ReactGrid
            rows={rows}
            columns={ingredientColumns}
            enableRangeSelection
          />
        </div>
      </CardContent>
    </Card>
  );
}
