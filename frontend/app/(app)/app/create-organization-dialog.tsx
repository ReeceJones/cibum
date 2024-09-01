"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { IconX } from "@tabler/icons-react";
import { fileTypeFromStream } from "file-type";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { organizationRoute } from "@/lib/routes/organization";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MAX_PHOTO_SIZE = 5000000;

async function isImage(file: File): Promise<boolean> {
  const result = await fileTypeFromStream(file.stream());

  return result?.mime.startsWith("image/") ?? false;
}

const createOrganizationFormSchema = z.object({
  logo: z
    .any()
    .optional()
    .refine(
      (filelist) =>
        filelist === undefined ||
        filelist.length === 0 ||
        (filelist[0]?.size ?? 0) < MAX_PHOTO_SIZE,
      "Max size is 5MB."
    )
    .refine(
      async (filelist) =>
        filelist === undefined ||
        filelist.length === 0 ||
        filelist[0] === undefined ||
        isImage(filelist[0]),
      "Only image formats are supported."
    ),
  name: z.string().min(3).max(50),
  id: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9-]+$/, "Must be alphanumeric with dashes")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
});

function CreateOrganizationForm() {
  const { push } = useRouter();
  const clerk = useClerk();
  const form = useForm<z.infer<typeof createOrganizationFormSchema>>({
    resolver: zodResolver(createOrganizationFormSchema),
  });
  const [loading, setLoading] = useState(false);

  const logoRef = form.register("logo");

  async function onSubmit(data: z.infer<typeof createOrganizationFormSchema>) {
    console.log(data);
    setLoading(true);

    let organization;
    try {
      organization = await clerk.createOrganization({
        name: data.name,
        slug: data.id,
      });
    } catch (error) {
      toast("Failed to create organization");
      setLoading(false);
      return;
    }

    if (!organization.slug) {
      setLoading(false);
      toast("Failed to create organization: Organization slug is missing");
      return;
    }

    if (
      data.logo !== undefined &&
      data.logo.length > 0 &&
      data.logo[0] !== undefined
    ) {
      try {
        await organization.setLogo({
          file: data.logo[0],
        });
      } catch (error) {
        console.error("Failed to set organization logo", error);
        return;
      }
    }

    push(organizationRoute({ slug: organization.slug }));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Smith Farms" />
                </FormControl>
                <FormDescription>
                  The name of your business or organization
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                {field.value && (
                  <div className="w-20 h-20">
                    <img src={URL.createObjectURL(field.value)} alt="Logo" />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Input
                      type="file"
                      {...logoRef}
                      onChange={(event) => {
                        field.onChange(event.target?.files?.[0] ?? undefined);
                      }}
                    />
                  </FormControl>
                  {field.value && (
                    <Button
                      variant="outline-destructive"
                      className="w-10 p-0"
                      onClick={() => {
                        form.resetField(field.name);
                      }}
                    >
                      <IconX size={16} />
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: smith-farms" />
                </FormControl>
                <FormDescription>
                  The unique identifier for your organization within Cibum. We
                  will generate one for you if you don&apos;t provide one.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="accent"
            loading={loading}
            className="w-44"
          >
            Create Organization
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CreateOrganizationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to use Cibum with your team
          </DialogDescription>
        </DialogHeader>
        <CreateOrganizationForm />
      </DialogContent>
    </Dialog>
  );
}
