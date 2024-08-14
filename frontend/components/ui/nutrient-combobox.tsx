"use client";

import { useGraphQLQuery } from "@/lib/graphql";
import {
  getAllNutrientsKey,
  getAllNutrientsQuery,
} from "@/lib/queries/get-all-nutrients";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Combobox, ComboboxProps } from "./combobox";
import { Nutrient } from "@/lib/gql/graphql";
import { asNodeIdObject, NodeIdObject } from "@/lib/schemas/common";

export function VirtualizedNutrientComboBox({
  ...props
}: Partial<ComboboxProps<NodeIdObject<Nutrient>>>) {
  const { orgId, isLoaded } = useAuth();
  const getAllNutrients = useGraphQLQuery(getAllNutrientsQuery);
  const { data, status } = useQuery({
    ...getAllNutrients,
    queryKey: getAllNutrientsKey({ orgId: orgId ?? "" }),
    enabled: isLoaded && orgId != null,
  });

  return (
    <Combobox
      loading={status === "pending"}
      data={
        data?.nutrients.edges.map((e) => asNodeIdObject(e.node as Nutrient)) ??
        []
      }
      // @ts-expect-error
      getKey={(item) => item?.data.id}
      // @ts-expect-error
      getLabel={(item) => item?.data.name}
      // @ts-expect-error
      getSearchKeywords={(item) => [item?.data.name]}
      error={status === "error" ? "Error loading ingredients" : undefined}
      {...props}
    />
  );
}
