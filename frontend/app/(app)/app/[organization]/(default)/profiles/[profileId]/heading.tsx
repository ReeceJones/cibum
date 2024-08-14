import { PageHeading } from "@/components/ui/heading";
import { useProfile } from "./use-profile";

export function ProfileHeading() {
  const { profile } = useProfile();
  return (
    <div className="col-span-5">
      <PageHeading>{profile.name}</PageHeading>
      <p className="text-primary/75">{profile.description}</p>
    </div>
  );
}
