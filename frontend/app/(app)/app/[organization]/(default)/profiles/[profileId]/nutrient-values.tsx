import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGraphQLMutation } from "@/lib/graphql";
import { createProfileNutrientValueMutation } from "@/lib/mutations/create-profile-nutrient-value";
import { profileNutrientValueSchema } from "@/lib/schemas/profiles";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconDeviceFloppy,
  IconDotsVertical,
  IconEdit,
  IconSquareRoundedPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useProfile } from "./use-profile";
import { getProfileKey } from "@/lib/queries/get-profile";
import { toast } from "sonner";
import { VirtualizedNutrientComboBox } from "@/components/ui/nutrient-combobox";
import { Input } from "@/components/ui/input";
import { ProfileNutrientValue, UnitType } from "@/lib/gql/graphql";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateProfileNutrientValueMutation } from "@/lib/mutations/update-profile-nutrient-value";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteProfileNutrientValueMutation } from "@/lib/mutations/delete-profile-nutrient-value";
import { VirtualizedUnitComboBox } from "@/components/ui/unit-combobox";

function NutrientValueForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof profileNutrientValueSchema>>;
}) {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="nutrient"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Nutrient</FormLabel>
            <FormMessage />
            <FormControl>
              <VirtualizedNutrientComboBox
                required
                {...field}
                className="w-full"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex items-end space-x-2">
        <FormField
          control={form.control}
          name="grossEnergy"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Gross Energy</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Gross Energy"
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grossEnergyUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormMessage />
              <FormControl>
                <div className="w-full">
                  <VirtualizedUnitComboBox
                    type={UnitType.Energy}
                    required
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex items-end space-x-2">
        <FormField
          control={form.control}
          name="digestibleEnergy"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Digestible Energy</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Digestible Energy"
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="digestibleEnergyUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormMessage />
              <FormControl>
                <div className="w-full">
                  <VirtualizedUnitComboBox
                    type={UnitType.Energy}
                    required
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex items-end space-x-2">
        <FormField
          control={form.control}
          name="metabolizableEnergy"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Metabolizable Energy</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Metabolizable Energy"
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metabolizableEnergyUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormMessage />
              <FormControl>
                <div className="w-full">
                  <VirtualizedUnitComboBox
                    type={UnitType.Energy}
                    required
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex items-end space-x-2">
        <FormField
          control={form.control}
          name="netEnergy"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Net Energy</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Net Energy"
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="netEnergyUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormMessage />
              <FormControl>
                <div className="w-full">
                  <VirtualizedUnitComboBox
                    type={UnitType.Energy}
                    required
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function AddNutrientValueDialogContent({ onSave }: { onSave: () => void }) {
  const form = useForm<z.infer<typeof profileNutrientValueSchema>>({
    resolver: zodResolver(profileNutrientValueSchema),
    defaultValues: {
      id: crypto.randomUUID(),
    },
  });
  const createProfileNutrientValue = useGraphQLMutation(
    createProfileNutrientValueMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...createProfileNutrientValue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully created nutrient value", {
        icon: <IconDeviceFloppy size={18} />,
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create nutrient value", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(data: z.infer<typeof profileNutrientValueSchema>) {
    console.log(data);
    await mutation.mutateAsync({
      input: {
        profileId: profile.id,
        nutrientId: data.nutrient.id,
        grossEnergy: data.grossEnergy,
        grossEnergyUnitId: data.grossEnergyUnit?.id,
        digestibleEnergy: data.digestibleEnergy,
        digestibleEnergyUnitId: data.digestibleEnergyUnit?.id,
        metabolizableEnergy: data.metabolizableEnergy,
        metabolizableEnergyUnitId: data.metabolizableEnergyUnit?.id,
        netEnergy: data.netEnergy,
        netEnergyUnitId: data.netEnergyUnit?.id,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <NutrientValueForm form={form} />
      </Form>
      <div className="flex justify-between items-center">
        <DialogClose asChild>
          <Button variant="secondary" onClick={onSave}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          disabled={mutation.isPending}
          onClick={form.handleSubmit(onSubmit)}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

function AddNutrientValueDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="xs"
          className="flex items-center space-x-2"
        >
          <IconSquareRoundedPlus size={20} />
          <span>Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <IconSquareRoundedPlus size={24} />
            <span>Add Nutrient Value</span>
          </DialogTitle>
          <DialogDescription>
            Add a nutrient value to specify the energy composition of a specific
            nutrient.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AddNutrientValueDialogContent onSave={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditNutrientValueDialogContent({
  nutrientValue,
  onSave,
}: {
  nutrientValue: ProfileNutrientValue;
  onSave: () => void;
}) {
  const form = useForm<z.infer<typeof profileNutrientValueSchema>>({
    resolver: zodResolver(profileNutrientValueSchema),
    defaultValues: {
      id: nutrientValue.id,
      nutrient: {
        id: nutrientValue.nutrient.id,
        data: nutrientValue.nutrient,
      },
      grossEnergy: nutrientValue.grossEnergy ?? undefined,
      grossEnergyUnit: nutrientValue.grossEnergyUnit
        ? {
            id: nutrientValue.grossEnergyUnit.id,
            data: nutrientValue.grossEnergyUnit,
          }
        : undefined,
      digestibleEnergy: nutrientValue.digestibleEnergy ?? undefined,
      digestibleEnergyUnit: nutrientValue.digestibleEnergyUnit
        ? {
            id: nutrientValue.digestibleEnergyUnit.id,
            data: nutrientValue.digestibleEnergyUnit,
          }
        : undefined,
      metabolizableEnergy: nutrientValue.metabolizableEnergy ?? undefined,
      metabolizableEnergyUnit: nutrientValue.metabolizableEnergyUnit
        ? {
            id: nutrientValue.metabolizableEnergyUnit.id,
            data: nutrientValue.metabolizableEnergyUnit,
          }
        : undefined,
      netEnergy: nutrientValue.netEnergy ?? undefined,
      netEnergyUnit: nutrientValue.netEnergyUnit
        ? {
            id: nutrientValue.netEnergyUnit.id,
            data: nutrientValue.netEnergyUnit,
          }
        : undefined,
    },
  });
  const updateProfileNutrientValue = useGraphQLMutation(
    updateProfileNutrientValueMutation
  );
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...updateProfileNutrientValue,
    onSuccess: () => {
      toast("Successfully updated nutrient value", {
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update nutrient value", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(data: z.infer<typeof profileNutrientValueSchema>) {
    await mutation.mutateAsync({
      input: {
        id: nutrientValue.id,
        nutrientId: data.nutrient.id,
        grossEnergy: data.grossEnergy,
        grossEnergyUnitId: data.grossEnergyUnit
          ? data.grossEnergyUnit.id
          : null,
        digestibleEnergy: data.digestibleEnergy,
        digestibleEnergyUnitId: data.digestibleEnergyUnit
          ? data.digestibleEnergyUnit.id
          : null,
        metabolizableEnergy: data.metabolizableEnergy,
        metabolizableEnergyUnitId: data.metabolizableEnergyUnit
          ? data.metabolizableEnergyUnit.id
          : null,
        netEnergy: data.netEnergy,
        netEnergyUnitId: data.netEnergyUnit ? data.netEnergyUnit.id : null,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <NutrientValueForm form={form} />
      </Form>
      <div className="flex justify-between items-center">
        <DialogClose asChild>
          <Button variant="secondary" onClick={onSave}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          disabled={mutation.isPending}
          onClick={form.handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function EditNutrientValueDialog({
  nutrientValue,
  onSave,
}: {
  nutrientValue: ProfileNutrientValue;
  onSave: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center space-x-2">
          <IconEdit size={20} />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <IconEdit size={24} />
            <span>Edit Nutrient Value</span>
          </DialogTitle>
          <DialogDescription>
            Modify the nutrient value to specify the energy content of a
            specific nutrient.
          </DialogDescription>
        </DialogHeader>
        <div>
          <EditNutrientValueDialogContent
            nutrientValue={nutrientValue}
            onSave={() => {
              setOpen(false);
              onSave();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteNutrientValueAlertDialogActions({
  nutrientValue,
}: {
  nutrientValue: ProfileNutrientValue;
}) {
  const deleteProfileNutrientValue = useGraphQLMutation(
    deleteProfileNutrientValueMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...deleteProfileNutrientValue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully deleted nutrient value", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete nutrient value", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });

  async function onDelete() {
    await mutation.mutateAsync({
      input: {
        ids: [nutrientValue.id],
      },
    });
  }

  return (
    <>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={async (e) => {
          e.preventDefault();
          await onDelete();
        }}
      >
        Delete
      </AlertDialogAction>
    </>
  );
}

function DeleteNutrientValueAlertDialog({
  nutrientValue,
}: {
  nutrientValue: ProfileNutrientValue;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full flex items-center space-x-2"
        >
          <IconTrash size={20} />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-3">
            <IconTrash size={24} />
            <span>Delete Nutrient Value</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this nutrient value?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <DeleteNutrientValueAlertDialogActions
            nutrientValue={nutrientValue}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function NutrientValue({
  nutrientValue,
}: {
  nutrientValue: ProfileNutrientValue;
}) {
  const [open, setOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>{nutrientValue.nutrient.name}</TableCell>
      <TableCell className="text-right">
        {nutrientValue.grossEnergy != null && (
          <p>
            <strong>Gross Energy:</strong> {nutrientValue.grossEnergy}{" "}
            {nutrientValue.grossEnergyUnit?.symbol}
          </p>
        )}
        {nutrientValue.digestibleEnergy != null && (
          <p>
            <strong>Digestible Energy:</strong> {nutrientValue.digestibleEnergy}{" "}
            {nutrientValue.digestibleEnergyUnit?.symbol}
          </p>
        )}
        {nutrientValue.metabolizableEnergy != null && (
          <p>
            <strong>Metabolizable Energy:</strong>{" "}
            {nutrientValue.metabolizableEnergy}{" "}
            {nutrientValue.metabolizableEnergyUnit?.symbol}
          </p>
        )}
        {nutrientValue.netEnergy != null && (
          <p>
            <strong>Net Energy:</strong> {nutrientValue.netEnergy}{" "}
            {nutrientValue.netEnergyUnit?.symbol}
          </p>
        )}
      </TableCell>
      <TableCell className="w-10">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="xs">
              <IconDotsVertical size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="space-y-1">
            <EditNutrientValueDialog
              onSave={() => setOpen(false)}
              nutrientValue={nutrientValue}
            />
            <DeleteNutrientValueAlertDialog nutrientValue={nutrientValue} />
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
}

export function NutrientValues() {
  const { profile } = useProfile();

  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-2">
          <div className="flex-1 space-y-1">
            <CardTitle>Nutrient Values</CardTitle>
            <CardDescription>
              Set the nutrient composition of ingredients used in diets.
            </CardDescription>
          </div>
          <AddNutrientValueDialog />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nutrient</TableHead>
              <TableHead className="text-right">Values</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.nutrientValues.map((nutrientValue) => (
              <NutrientValue
                key={nutrientValue.id}
                nutrientValue={nutrientValue}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
