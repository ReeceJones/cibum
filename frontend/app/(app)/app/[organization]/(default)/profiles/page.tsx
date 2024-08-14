import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProfileDialog } from "./create-profile-dialog";
import { ProfileTable } from "./profile-table";

export default function ProfilesPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Profiles</CardTitle>
          <CardDescription>
            Managed the profiles used to formulate diets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <CreateProfileDialog />
            </div>
            <ProfileTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
