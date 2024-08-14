"use client";

import { useGraphQLQuery } from "@/lib/graphql";
import { getAllUnitsKey, getAllUnitsQuery } from "@/lib/queries/get-all-units";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Combobox, ComboboxProps } from "./combobox";
import { Unit } from "@/lib/gql/graphql";
import { asNodeIdObject, NodeIdObject } from "@/lib/schemas/common";

export function VirtualizedUnitComboBox({
  ...props
}: Partial<ComboboxProps<NodeIdObject<Unit>>>) {
  const { orgId, isLoaded } = useAuth();
  const getAllUnits = useGraphQLQuery(getAllUnitsQuery);
  const { data, status } = useQuery({
    ...getAllUnits,
    queryKey: getAllUnitsKey(),
    enabled: isLoaded && orgId != null,
  });

  return (
    <Combobox
      loading={status === "pending"}
      data={data?.units.edges.map((e) => asNodeIdObject(e.node as Unit)) ?? []}
      // @ts-expect-error
      getKey={(item) => item?.data.id}
      // @ts-expect-error
      getLabel={(item) => item?.data.symbol}
      // @ts-expect-error
      getSearchKeywords={(item) => [item?.data.name, item?.data.symbol]}
      error={status === "error" ? "Error loading units" : undefined}
      {...props}
    />
  );
}
