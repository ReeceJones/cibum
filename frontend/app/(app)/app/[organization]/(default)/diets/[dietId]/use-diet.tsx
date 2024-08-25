import { Diet, DietOutputVersion } from "@/lib/gql/graphql";
import { createContext, useContext } from "react";

type DietContextType = {
  diet: Diet;
  output: DietOutputVersion | null;
  setOutput: React.Dispatch<React.SetStateAction<DietOutputVersion | null>>;
};

const DietContext = createContext<DietContextType | undefined>(undefined);

export function DietProvider({
  diet,
  output,
  setOutput,
  children,
}: {
  diet: Diet;
  output: DietOutputVersion | null;
  setOutput: React.Dispatch<React.SetStateAction<DietOutputVersion | null>>;
  children: React.ReactNode;
}) {
  return (
    <DietContext.Provider value={{ diet, output, setOutput }}>
      {children}
    </DietContext.Provider>
  );
}

export function useDiet() {
  const context = useContext(DietContext);
  if (!context) {
    throw new Error("useDiet must be used within a DietProvider");
  }
  return context;
}
