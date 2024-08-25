import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDiet } from "./use-diet";
import { useEffect, useState } from "react";
import { Profile } from "@/lib/gql/graphql";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import {
  IconGripVertical,
  IconSquareRoundedPlus,
  IconTrash,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useMeasure } from "@uidotdev/usehooks";
import {
  getAllProfilesKey,
  getAllProfilesQuery,
} from "@/lib/queries/get-all-profiles";
import { useGraphQLMutation, useGraphQLQuery } from "@/lib/graphql";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { ClipLoader } from "react-spinners";
import { updateDietProfilesMutation } from "@/lib/mutations/update-diet-profiles";
import { getDietKey } from "@/lib/queries/get-diet";
import { toast } from "sonner";
import { profileRoute } from "@/lib/routes/profiles";
import Link from "next/link";

function AddProfileCommandContent() {
  const { diet } = useDiet();
  const { orgId, isLoaded } = useAuth();
  const queryClient = useQueryClient();
  const getAllProfiles = useGraphQLQuery(getAllProfilesQuery);
  const updateDietProfiles = useGraphQLMutation(updateDietProfilesMutation);
  const { data, status } = useQuery({
    ...getAllProfiles,
    queryKey: getAllProfilesKey({
      orgId: orgId ?? "",
    }),
    enabled: isLoaded,
  });
  const mutation = useMutation({
    ...updateDietProfiles,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getDietKey({ dietId: diet.id }),
      });

      toast.success("Profile added to diet.");
    },
    onError: (error) => {
      console.error(error);

      toast.error("Error adding profile to diet.");
    },
  });
  const dietProfileIds = diet.latestConfigurationVersion?.profiles.map(
    (profile) => profile.id
  );

  return (
    <>
      <CommandInput placeholder="Search profiles..." />
      <CommandList>
        <CommandEmpty>
          {status === "pending" && <ClipLoader size={24} />}
          {status === "error" && (
            <span className="text-destructive">Error loading profiles</span>
          )}
          {status === "success" && <span>No profiles found.</span>}
        </CommandEmpty>
        <CommandGroup>
          {data?.profiles.edges
            .filter(({ node }) => !dietProfileIds?.includes(node.id))
            .map(({ node }) => (
              <CommandItem
                key={node.id}
                value={node.id}
                keywords={[node.name, node.description ?? ""]}
                onSelect={async (value) => {
                  await mutation.mutateAsync({
                    input: {
                      dietId: diet.id,
                      profileIds: [
                        ...(diet.latestConfigurationVersion?.profiles.map(
                          (profile) => profile.id
                        ) ?? []),
                        value,
                      ],
                    },
                  });
                }}
              >
                {node.name}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </>
  );
}

function AddProfile() {
  const [ref, measurements] = useMeasure();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="w-full flex items-center space-x-2"
          ref={ref}
        >
          <IconSquareRoundedPlus size={20} />
          <span>Add</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: measurements.width ?? undefined }}
      >
        <Command>
          <AddProfileCommandContent />
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ProfileRow({ profile }: { profile: Profile }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: profile.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const { diet } = useDiet();
  const { orgSlug } = useAuth();
  const queryClient = useQueryClient();
  const updateDietProfiles = useGraphQLMutation(updateDietProfilesMutation);
  const mutation = useMutation({
    ...updateDietProfiles,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getDietKey({ dietId: diet.id }),
      });

      toast.success("Profile removed from diet.");
    },
    onError: (error) => {
      console.error(error);

      toast.error("Error removing profile from diet.");
    },
  });

  return (
    <div className="flex space-x-2 items-center" style={style} ref={setNodeRef}>
      <Button variant="ghostSecondary" size="sm" {...listeners} {...attributes}>
        <IconGripVertical size={16} />
      </Button>
      <div className="flex-1">
        <Link
          href={profileRoute({
            organizationSlug: orgSlug ?? "",
            profileId: profile.id,
          })}
        >
          <Button variant="link" size="sm">
            {profile.name}
          </Button>
        </Link>
      </div>
      <Button
        variant="ghostDestructive"
        size="sm"
        onClick={async () => {
          await mutation.mutateAsync({
            input: {
              dietId: diet.id,
              profileIds:
                diet.latestConfigurationVersion?.profiles
                  .filter((item) => item.id !== profile.id)
                  .map((item) => item.id) ?? [],
            },
          });
        }}
      >
        <IconTrash size={16} />
      </Button>
    </div>
  );
}

export function Profiles() {
  const { diet } = useDiet();
  const [items, setItems] = useState<Profile[]>([]);
  const updateDietProfiles = useGraphQLMutation(updateDietProfilesMutation);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...updateDietProfiles,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getDietKey({ dietId: diet.id }),
      });

      toast.success("Profiles updated.");
    },
    onError: (error) => {
      console.error(error);

      toast.error("Error updating profiles.");
    },
  });

  useEffect(() => {
    setItems(diet.latestConfigurationVersion?.profiles ?? []);
  }, [diet, setItems]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      setItems((items) => {
        const ids = items.map((item) => item.id);
        const oldIndex = ids.indexOf(active.id);
        const newIndex = ids.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });

      await mutation.mutateAsync({
        input: {
          dietId: diet.id,
          profileIds: items.map((item) => item.id),
        },
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profiles</CardTitle>
        <CardDescription>
          The profiles used to build this diet. Profiles will take precedence in
          the order they are listed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <DndContext
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((profile) => (
                <ProfileRow key={profile.id} profile={profile} />
              ))}
            </SortableContext>
          </DndContext>
          <AddProfile />
        </div>
      </CardContent>
    </Card>
  );
}
