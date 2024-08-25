import { PageHeading } from "@/components/ui/heading";
import { useDiet } from "./use-diet";

export function DietHeading() {
  const { diet } = useDiet();
  return (
    <div className="col-span-5">
      <PageHeading>{diet.name}</PageHeading>
      <p className="text-primary/75">{diet.description}</p>
    </div>
  );
}
