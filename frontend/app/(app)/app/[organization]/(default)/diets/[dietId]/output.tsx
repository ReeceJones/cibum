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
import {
  DietIngredientOutput,
  DietOutputVersion,
  Ingredient,
} from "@/lib/gql/graphql";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Badge } from "@/components/ui/badge";
import { ClipLoader } from "react-spinners";

function getTotals(output: DietOutputVersion): DietIngredientOutput {
  // weighted sums of all rows
  const weights = output.ingredientOutputs.reduce((acc, output) => {
    acc[output.id] =
      output.amount * (output.amountUnit.baseUnitMultiplier ?? 0.0);
    return acc;
  }, {} as Record<string, number>);

  return {
    id: "totals",
    ingredient: {
      id: "totals",
      name: "Totals",
    } as Ingredient,
    amount: output.ingredientOutputs.reduce(
      (acc, output) => acc + output.amount,
      0
    ),
    amountUnit: output.ingredientOutputs[0].amountUnit,
    cost: output.ingredientOutputs.reduce(
      (acc, output) => acc + (output.cost ?? 0) * weights[output.id],
      0
    ),
    costUnit: output.ingredientOutputs[0].costUnit,
    grossEnergy: output.ingredientOutputs.reduce(
      (acc, output) => acc + (output.grossEnergy ?? 0) * weights[output.id],
      0
    ),
    grossEnergyUnit: output.ingredientOutputs[0].grossEnergyUnit,
    digestibleEnergy: output.ingredientOutputs.reduce(
      (acc, output) =>
        acc + (output.digestibleEnergy ?? 0) * weights[output.id],
      0
    ),
    digestibleEnergyUnit: output.ingredientOutputs[0].digestibleEnergyUnit,
    metabolizableEnergy: output.ingredientOutputs.reduce(
      (acc, output) =>
        acc + (output.metabolizableEnergy ?? 0) * weights[output.id],
      0
    ),
    metabolizableEnergyUnit:
      output.ingredientOutputs[0].metabolizableEnergyUnit,
    netEnergy: output.ingredientOutputs.reduce(
      (acc, output) => acc + (output.netEnergy ?? 0) * weights[output.id],
      0
    ),
    netEnergyUnit: output.ingredientOutputs[0].netEnergyUnit,
  } as DietIngredientOutput;
}

export function Output() {
  const { diet, output, setOutput } = useDiet();
  const [rows, setRows] = useState<DietIngredientOutput[]>([]);
  const [columns, setColumns] = useState<any[]>([
    {
      field: "ingredient.name",
      headerName: "Ingredient",
      width: 250,
      filter: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "numericColumn",
      valueFormatter: (params: any) => {
        return `${params.value} ${params.data.amountUnit.symbol}`;
      },
      filter: true,
    },
    {
      field: "cost",
      headerName: "Cost",
      type: "numericColumn",
      valueFormatter: (params: any) => {
        return `${params.value} ${params.data.costUnit.symbol}`;
      },
      filter: true,
    },
    {
      field: "grossEnergy",
      headerName: "Gross Energy",
      type: "numericColumn",
      valueFormatter: (params: any) => {
        return `${params.value} ${params.data.grossEnergyUnit.symbol}`;
      },
      filter: true,
    },
    {
      field: "digestibleEnergy",
      headerName: "Digestible Energy",
      type: "numericColumn",
      valueFormatter: (params: any) => {
        return `${params.value} ${params.data.digestibleEnergyUnit?.symbol}`;
      },
      filter: true,
    },
    {
      field: "metabolizableEnergy",
      headerName: "Metabolizable Energy",
      type: "numericColumn",
      valueFormatter: (params: any) => {
        return `${params.value} ${params.data.metabolizableEnergyUnit?.symbol}`;
      },
      filter: true,
    },
    {
      field: "netEnergy",
      headerName: "Net Energy",
      type: "numericColumn",
      valueFormatter: (params: any) => {
        return `${params.value} ${params.data.netEnergyUnit?.symbol}`;
      },
      filter: true,
    },
  ]);
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
      setRows([...output.ingredientOutputs, getTotals(output)]);
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
            <div className="flex space-x-3 items-center">
              <CardTitle>Diet</CardTitle>
              {output?.status && <Badge>{output.status}</Badge>}
            </div>
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
        {mutation.isPending && (
          <div className="flex justify-center p-20 h-[500px]">
            <ClipLoader />
          </div>
        )}
        {mutation.isError && (
          <div className="flex justify-center p-20 text-destructive h-[500px]">
            <p>Error generating output</p>
          </div>
        )}
        {!(mutation.isPending || mutation.isError) && output && (
          <div className="w-full h-[500px] ag-theme-quartz">
            <AgGridReact columnDefs={columns} rowData={rows} rowHeight={32} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
