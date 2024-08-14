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
import { useGraphQLMutation } from "@/lib/graphql";
import { createProfileMutation } from "@/lib/mutations/create-profile";
import { getAllProfilesKey } from "@/lib/queries/get-all-profiles";
import { profileSchema } from "@/lib/schemas/profiles";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDeviceFloppy, IconNotebook } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function CreateProfileForm({ onSave }: { onSave: () => void }) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: crypto.randomUUID(),
    },
  });

  const { orgId } = useAuth();
  const createProfile = useGraphQLMutation(createProfileMutation);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllProfilesKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully created profile", {
        icon: <IconDeviceFloppy size={18} />,
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create profile", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    console.log(data);
    const profile = await mutation.mutateAsync({
      input: {
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
          Create
        </Button>
      </div>
    </div>
  );
}

export function CreateProfileDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <IconNotebook size={20} />
          <span>Create Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <IconNotebook size={24} />
            <span>Create Profile</span>
          </DialogTitle>
          <DialogDescription>
            Create a new profile to control how diets are formulated.
          </DialogDescription>
        </DialogHeader>
        <CreateProfileForm onSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
