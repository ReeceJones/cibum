import { Protect } from "@clerk/nextjs";
import { OrganizationSyncAndProtect } from "./organization-sync-and-protect";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrganizationSyncAndProtect>{children}</OrganizationSyncAndProtect>;
}
