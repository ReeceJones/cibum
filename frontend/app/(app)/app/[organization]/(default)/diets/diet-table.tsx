"use client";
import { Button } from "@/components/ui/button";
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
import { Diet } from "@/lib/gql/graphql";
import { useGraphQLMutation, useGraphQLQuery } from "@/lib/graphql";
import { deleteDietMutation } from "@/lib/mutations/delete-diet";
import { getAllDietsKey, getAllDietsQuery } from "@/lib/queries/get-all-diets";
import { useAuth } from "@clerk/nextjs";
import {
  IconDeviceFloppy,
  IconDotsVertical,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { EditDietDialog } from "./edit-diet-dialog";
import Link from "next/link";
import { dietRoute } from "@/lib/routes/diets";

function DietDeleteButton({ diet }: { diet: Diet }) {
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const deleteDiet = useGraphQLMutation(deleteDietMutation);
  const mutation = useMutation({
    ...deleteDiet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllDietsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully deleted diet", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete diet", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onDelete() {
    await mutation.mutateAsync({
      input: {
        ids: [diet.id],
      },
    });
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

function DietDropdown({ diet }: { diet: Diet }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <IconDotsVertical size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="space-y-2">
          <EditDietDialog diet={diet} />
          <DietDeleteButton diet={diet} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DietTable() {
  const { orgId, orgSlug, isLoaded } = useAuth();
  const { queryFn } = useGraphQLQuery(getAllDietsQuery);
  const { data, status } = useQuery({
    queryFn,
    queryKey: getAllDietsKey({ orgId: orgId ?? "" }),
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
    return <p className="text-destructive">Error occurred fetching diets</p>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.diets.edges.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <p className="text-center italic">No diets found</p>
              </TableCell>
            </TableRow>
          )}
          {data.diets.edges.map((diet) => (
            <TableRow key={diet.node.id}>
              <TableCell>
                <Link
                  href={dietRoute({
                    organizationSlug: orgSlug ?? "",
                    dietId: diet.node.id,
                  })}
                >
                  <Button variant="link">{diet.node.name}</Button>
                </Link>
              </TableCell>
              <TableCell>
                <span>{diet.node.description}</span>
              </TableCell>
              <TableCell>
                <DietDropdown diet={diet.node as Diet} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
