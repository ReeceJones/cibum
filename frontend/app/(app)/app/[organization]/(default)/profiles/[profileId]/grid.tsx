"use client";
import { PageHeading } from "@/components/ui/heading";
import { ProfileCards } from "./cards";
import { ProfileProvider } from "./use-profile";
import { useGraphQLQuery } from "@/lib/graphql";
import { getProfileKey, getProfileQuery } from "@/lib/queries/get-profile";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { Profile } from "@/lib/gql/graphql";
import { ProfileHeading } from "./heading";

export function ProfileGrid() {
  const { profileId } = useParams<{ profileId: string }>();
  const getProfile = useGraphQLQuery(getProfileQuery, {
    profileId,
  });
  const { data, status } = useQuery({
    ...getProfile,
    queryKey: getProfileKey({ profileId }),
  });

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
    <ProfileProvider profile={data.node as Profile}>
      <div className="grid grid-cols-5 gap-8">
        <ProfileHeading />
        <ProfileCards />
      </div>
    </ProfileProvider>
  );
}
