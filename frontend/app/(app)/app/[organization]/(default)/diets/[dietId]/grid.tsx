"use client";
import { DietCards } from "./cards";
import { DietProvider } from "./use-diet";
import { useGraphQLQuery } from "@/lib/graphql";
import { getDietKey, getDietQuery } from "@/lib/queries/get-diet";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { Diet, DietOutputVersion } from "@/lib/gql/graphql";
import { DietHeading } from "./heading";
import { useEffect, useState } from "react";

export function DietGrid() {
  const [output, setOutput] = useState<DietOutputVersion | null>(null);
  const { dietId } = useParams<{ dietId: string }>();
  const getProfile = useGraphQLQuery(getDietQuery, {
    dietId,
  });
  const { data, status } = useQuery({
    ...getProfile,
    queryKey: getDietKey({ dietId }),
  });

  useEffect(() => {
    if (status === "success" && data?.node) {
      const diet: Diet = data.node as Diet;
      setOutput(diet.latestOutputVersion as DietOutputVersion);
    }
  }, [data]);

  if (status === "pending") {
    return (
      <div className="flex justify-center p-20">
        <ClipLoader />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex justify-center p-20 text-destructive">
        <p>Error loading profile</p>
      </div>
    );
  }

  return (
    <DietProvider
      diet={data.node as Diet}
      setOutput={setOutput}
      output={output}
    >
      <div className="grid grid-cols-5 gap-8">
        <DietHeading />
        <DietCards />
      </div>
    </DietProvider>
  );
}
