"use client";

import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function OrganizationSyncAndProtect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setActive, isLoaded, userMemberships } = useOrganizationList({
    userMemberships: true,
  });
  const { organization } = useParams() as { organization: string };
  const { push } = useRouter();

  useEffect(() => {
    if (!isLoaded || userMemberships.isLoading) return;

    const membership = userMemberships.data.find(
      (membership) => membership.organization.slug === organization
    );

    if (membership !== undefined) {
      void setActive({ organization: membership.organization.id });
    } else {
      setActive({
        organization: null,
      });
      void push("/app");
    }
  }, [isLoaded, setActive, organization, userMemberships.data]);

  return children;
}
