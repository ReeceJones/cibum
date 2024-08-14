"use client";

import { useGraphQLQuery } from "@/lib/graphql";
import {
  getAllIngredientsKey,
  getAllIngredientsQuery,
} from "@/lib/queries/get-all-ingredients";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Combobox, ComboboxProps } from "./combobox";
import { Ingredient } from "@/lib/gql/graphql";
import { asNodeIdObject, NodeIdObject } from "@/lib/schemas/common";

export function VirtualizedIngredientComboBox({
  ...props
}: Partial<ComboboxProps<NodeIdObject<Ingredient>>>) {
  const { orgId, isLoaded } = useAuth();
  const getAllIngredients = useGraphQLQuery(getAllIngredientsQuery);
  const { data, status } = useQuery({
    ...getAllIngredients,
    queryKey: getAllIngredientsKey({ orgId: orgId ?? "" }),
    enabled: isLoaded && orgId != null,
  });

  return (
    <Combobox
      loading={status === "pending"}
      data={
        data?.ingredients.edges.map((e) =>
          asNodeIdObject(e.node as Ingredient)
        ) ?? []
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
