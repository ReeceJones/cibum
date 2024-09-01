import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeading } from "@/components/ui/heading";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { CreateOrganizationDialog } from "./create-organization-dialog";
import { Button } from "@/components/ui/button";
import { organizationRoute } from "@/lib/routes/organization";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AppIndexPage() {
  const user = await currentUser();

  if (!user) {
    return <div>not singed in</div>;
  }

  const organizations = await clerkClient().users.getOrganizationMembershipList(
    {
      userId: user.id,
    }
  );

  return (
    <div className="flex justify-center">
      <div className="max-w-[400px] flex-1 space-y-8">
        <PageHeading>Organizations</PageHeading>
        <div className="space-y-4 w-full">
          {organizations.data.length === 0 && (
            <div className="text-center text-primary/70 italic">
              You are not a member of any organizations. Create or join an
              organization to get started.
            </div>
          )}
          {organizations.data.map((organization) => (
            <Card key={organization.id}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {organization.organization.hasImage &&
                    organization.organization.imageUrl !== undefined && (
                      <div className="w-20 h-20 min-w-20 min-h-20">
                        <img
                          alt="Logo"
                          src={organization.organization.imageUrl}
                          className="rounded-sm"
                        />
                      </div>
                    )}
                  <div>
                    <CardTitle>{organization.organization.name}</CardTitle>
                    <CardDescription>
                      {organization.organization.slug ?? (
                        <span className="text-destructive">
                          ERROR: Organization has no id
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {organization.organization.slug && (
                  <Link
                    href={organizationRoute({
                      slug: organization.organization.slug,
                    })}
                  >
                    <Button>Open</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <CreateOrganizationDialog />
      </div>
    </div>
  );
}
