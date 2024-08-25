import { Output } from "./output";
import { Profiles } from "./profiles";

export function DietCards() {
  return (
    <>
      <div className="col-span-2 flex flex-col space-y-8">
        <Profiles />
      </div>
      <div className="col-span-3 flex flex-col space-y-8">
        <Output />
      </div>
    </>
  );
}
