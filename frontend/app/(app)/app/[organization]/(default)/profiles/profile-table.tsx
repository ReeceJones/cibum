"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Profile } from "@/lib/gql/graphql";
import { useGraphQLMutation, useGraphQLQuery } from "@/lib/graphql";
import { deleteProfileMutation } from "@/lib/mutations/delete-profile";
import {
  getAllProfilesKey,
  getAllProfilesQuery,
} from "@/lib/queries/get-all-profiles";
import { profileSchema } from "@/lib/schemas/profiles";
import { useAuth } from "@clerk/nextjs";
import {
  IconCheck,
  IconDeviceFloppy,
  IconDotsVertical,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { EditProfileDialog } from "./edit-profile-dialog";
import Link from "next/link";
import { profileRoute } from "@/lib/routes/profiles";

function ProfileDeleteButton({ profile }: { profile: Profile }) {
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const deleteProfile = useGraphQLMutation(deleteProfileMutation);
  const mutation = useMutation({
    ...deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllProfilesKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully deleted profile", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete profile", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onDelete() {
    await mutation.mutateAsync({
      input: {
        ids: [profile.id],
      },
    });
  }

  if (profile.managed) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      className="flex items-center space-x-2 w-full"
      onClick={onDelete}
    >
      <IconTrash size={20} />
      <span>Delete</span>
    </Button>
  );
}

function ProfileDropdown({ profile }: { profile: Profile }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <IconDotsVertical size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="space-y-2">
          <EditProfileDialog profile={profile} />
          <ProfileDeleteButton profile={profile} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ProfileTable() {
  const { orgId, orgSlug, isLoaded } = useAuth();
  const { queryFn } = useGraphQLQuery(getAllProfilesQuery);
  const { data, status } = useQuery({
    queryFn,
    queryKey: getAllProfilesKey({ orgId: orgId ?? "" }),
    enabled: isLoaded,
  });

  if (status === "pending") {
    return (
      <div>
        <ClipLoader size={24} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-destructive">Error occurred fetching ingredients</p>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Custom</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.profiles.edges.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <p className="text-center italic">No profiles found</p>
              </TableCell>
            </TableRow>
          )}
          {data.profiles.edges.map((profile) => (
            <TableRow key={profile.node.id}>
              <TableCell>
                <Link
                  href={profileRoute({
                    organizationSlug: orgSlug ?? "",
                    profileId: profile.node.id,
                  })}
                >
                  <Button variant="link">{profile.node.name}</Button>
                </Link>
              </TableCell>
              <TableCell>
                <span>{profile.node.description}</span>
              </TableCell>
              <TableCell>
                <div>
                  {!profile.node.managed ? (
                    <IconCheck size={20} />
                  ) : (
                    <IconX size={20} />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ProfileDropdown profile={profile.node as Profile} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
