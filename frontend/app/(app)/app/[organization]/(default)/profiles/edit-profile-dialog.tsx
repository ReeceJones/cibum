"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Profile } from "@/lib/gql/graphql";
import { useGraphQLMutation } from "@/lib/graphql";
import { updateProfileMutation } from "@/lib/mutations/update-profile";
import { getAllProfilesKey } from "@/lib/queries/get-all-profiles";
import { profileSchema } from "@/lib/schemas/profiles";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDeviceFloppy, IconEdit, IconNotebook } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function EditProfileForm({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: () => void;
}) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: profile.id,
      name: profile.name,
      description: profile.description ?? undefined,
    },
  });

  const { orgId } = useAuth();
  const updateProfile = useGraphQLMutation(updateProfileMutation);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllProfilesKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully updated profile", {
        icon: <IconDeviceFloppy size={18} />,
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update profile", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    console.log(data);
    await mutation.mutateAsync({
      input: {
        id: data.id,
        name: data.name,
        description: data.description ?? null,
      },
    });
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <div className="flex justify-between">
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button
          disabled={mutation.isPending}
          onClick={form.handleSubmit(onSubmit)}
        >
          Update
        </Button>
      </div>
    </div>
  );
}

export function EditProfileDialog({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 w-full">
          <IconEdit size={20} />
          <span>Update Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <IconEdit size={24} />
            <span>Update Profile</span>
          </DialogTitle>
          <DialogDescription>
            Update profile details for an existing profile.
          </DialogDescription>
        </DialogHeader>
        <EditProfileForm profile={profile} onSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
