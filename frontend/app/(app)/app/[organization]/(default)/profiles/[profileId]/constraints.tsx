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
import { createProfileConstraintMutation } from "@/lib/mutations/create-profile-constraint";
import { profileConstraintSchema } from "@/lib/schemas/profiles";
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
import { VirtualizedIngredientComboBox } from "@/components/ui/ingredient-combobox";
import { Input } from "@/components/ui/input";
import {
  ProfileConstraintMode,
  ProfileConstraintType,
  ProfileConstraint,
  UnitType,
  ConstraintOperator,
} from "@/lib/gql/graphql";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateProfileConstraintMutation } from "@/lib/mutations/update-profile-constraint";
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
import { deleteProfileConstraintMutation } from "@/lib/mutations/delete-profile-constraint";
import { VirtualizedUnitComboBox } from "@/components/ui/unit-combobox";
import { mapOperator, mapProfileConstraintType } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as uuid from "uuid";

function ConstraintForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof profileConstraintSchema>>;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end space-x-2">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a constraint type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ProfileConstraintType.GrossEnergy}>
                    Gross Energy
                  </SelectItem>
                  <SelectItem value={ProfileConstraintType.DigestibleEnergy}>
                    Digestible Energy
                  </SelectItem>
                  <SelectItem value={ProfileConstraintType.MetabolizableEnergy}>
                    Metabolizable Energy
                  </SelectItem>
                  <SelectItem value={ProfileConstraintType.NetEnergy}>
                    Net Energy
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="operator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comparison</FormLabel>
              <FormMessage />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Select a comparison" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ConstraintOperator.Equal}>
                    {mapOperator(ConstraintOperator.Equal)}
                  </SelectItem>
                  <SelectItem value={ConstraintOperator.NotEqual}>
                    {mapOperator(ConstraintOperator.NotEqual)}
                  </SelectItem>
                  <SelectItem value={ConstraintOperator.GreaterThan}>
                    {mapOperator(ConstraintOperator.GreaterThan)}
                  </SelectItem>
                  <SelectItem value={ConstraintOperator.GreaterThanOrEqual}>
                    {mapOperator(ConstraintOperator.GreaterThanOrEqual)}
                  </SelectItem>
                  <SelectItem value={ConstraintOperator.LessThan}>
                    {mapOperator(ConstraintOperator.LessThan)}
                  </SelectItem>
                  <SelectItem value={ConstraintOperator.LessThanOrEqual}>
                    {mapOperator(ConstraintOperator.LessThanOrEqual)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
      <div className="flex items-end space-x-2">
        <FormField
          control={form.control}
          name="literalValue"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Value</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Cost"
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="literalUnit"
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

function AddConstraintDialogContent({ onSave }: { onSave: () => void }) {
  const form = useForm<z.infer<typeof profileConstraintSchema>>({
    resolver: zodResolver(profileConstraintSchema),
    defaultValues: {
      id: uuid.v4(),
      mode: ProfileConstraintMode.Literal,
    },
  });
  const createProfileConstraint = useGraphQLMutation(
    createProfileConstraintMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...createProfileConstraint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully created constraint", {
        icon: <IconDeviceFloppy size={18} />,
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create constraint", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(data: z.infer<typeof profileConstraintSchema>) {
    console.log(data);
    await mutation.mutateAsync({
      input: {
        profileId: profile.id,
        type: data.type,
        mode: data.mode,
        operator: data.operator,
        literalValue: data.literalValue ?? null,
        literalUnitId: data.literalUnit?.id ?? null,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <ConstraintForm form={form} />
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

function AddConstraintDialog() {
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
            <span>Add Constraint</span>
          </DialogTitle>
          <DialogDescription>
            Add a constraint to specify the conditions the profile must meet.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AddConstraintDialogContent onSave={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditConstraintDialogContent({
  constraint,
  onSave,
}: {
  constraint: ProfileConstraint;
  onSave: () => void;
}) {
  const form = useForm<z.infer<typeof profileConstraintSchema>>({
    resolver: zodResolver(profileConstraintSchema),
    defaultValues: {
      id: constraint.id,
      type: constraint.type,
      mode: constraint.mode,
      operator: constraint.operator,
      literalValue: constraint.literalValue ?? undefined,
      literalUnit: constraint.literalUnit
        ? {
            id: constraint.literalUnit.id,
            data: constraint.literalUnit,
          }
        : undefined,
    },
  });
  const updateProfileConstraint = useGraphQLMutation(
    updateProfileConstraintMutation
  );
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...updateProfileConstraint,
    onSuccess: () => {
      toast("Successfully updated constraint", {
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update constraint", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(data: z.infer<typeof profileConstraintSchema>) {
    await mutation.mutateAsync({
      input: {
        id: constraint.id,
        type: data.type,
        mode: data.mode,
        operator: data.operator,
        literalValue: data.literalValue ?? null,
        literalUnitId: data.literalUnit?.id ?? null,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <ConstraintForm form={form} />
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

function EditConstraintDialog({
  constraint,
  onSave,
}: {
  constraint: ProfileConstraint;
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
            <span>Edit Constraint</span>
          </DialogTitle>
          <DialogDescription>
            Modify the constraint to specify what conditions a diet using this
            must meet.
          </DialogDescription>
        </DialogHeader>
        <div>
          <EditConstraintDialogContent
            constraint={constraint}
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

function DeleteConstraintAlertDialogActions({
  constraint,
}: {
  constraint: ProfileConstraint;
}) {
  const deleteProfileConstraint = useGraphQLMutation(
    deleteProfileConstraintMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...deleteProfileConstraint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully deleted constraint", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete constraint", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });

  async function onDelete() {
    await mutation.mutateAsync({
      input: {
        ids: [constraint.id],
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

function DeleteConstraintAlertDialog({
  constraint,
}: {
  constraint: ProfileConstraint;
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
            <span>Delete Constraint</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this constraint?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <DeleteConstraintAlertDialogActions constraint={constraint} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Constraint({ constraint }: { constraint: ProfileConstraint }) {
  const [open, setOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>{mapProfileConstraintType(constraint.type)}</TableCell>
      <TableCell className="text-center">
        {mapOperator(constraint.operator)}
      </TableCell>
      <TableCell className="text-right">
        {constraint.mode === ProfileConstraintMode.Literal &&
        constraint.literalValue != null &&
        constraint.literalUnit
          ? `${constraint.literalValue} ${constraint.literalUnit.symbol}`
          : "N/A"}
      </TableCell>
      <TableCell className="w-10">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="xs">
              <IconDotsVertical size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="space-y-1">
            <EditConstraintDialog
              onSave={() => setOpen(false)}
              constraint={constraint}
            />
            <DeleteConstraintAlertDialog constraint={constraint} />
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
}

export function Constraints() {
  const { profile } = useProfile();

  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-2">
          <div className="flex-1 space-y-1">
            <CardTitle>Constraints</CardTitle>
            <CardDescription>
              Control what conditions diets using this profile must meet.
            </CardDescription>
          </div>
          <AddConstraintDialog />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Constraint</TableHead>
              <TableHead className="text-right">Comparison</TableHead>
              <TableHead className="text-right">Reference Value</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.constraints.map((constraint) => (
              <Constraint key={constraint.id} constraint={constraint} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
