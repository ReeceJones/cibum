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
import { createProfileIngredientCostMutation } from "@/lib/mutations/create-profile-ingredient-cost";
import { profileIngredientCostSchema } from "@/lib/schemas/profiles";
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
  IngredientCostMode,
  ProfileIngredientCost,
  UnitType,
} from "@/lib/gql/graphql";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateProfileIngredientCostMutation } from "@/lib/mutations/update-profile-ingredient-cost";
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
import { deleteProfileIngredientCostMutation } from "@/lib/mutations/delete-profile-ingredient-cost";
import { VirtualizedUnitComboBox } from "@/components/ui/unit-combobox";

function IngredientCostForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof profileIngredientCostSchema>>;
}) {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="ingredient"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Ingredient</FormLabel>
            <FormMessage />
            <FormControl>
              <VirtualizedIngredientComboBox
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
          name="literalCost"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Cost</FormLabel>
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
          name="literalCostUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormMessage />
              <FormControl>
                <div className="w-full">
                  <VirtualizedUnitComboBox
                    type={UnitType.Cost}
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

function AddIngredientCostDialogContent({ onSave }: { onSave: () => void }) {
  const form = useForm<z.infer<typeof profileIngredientCostSchema>>({
    resolver: zodResolver(profileIngredientCostSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      mode: IngredientCostMode.Literal,
    },
  });
  const createProfileIngredientCost = useGraphQLMutation(
    createProfileIngredientCostMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...createProfileIngredientCost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully created ingredient cost", {
        icon: <IconDeviceFloppy size={18} />,
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create ingredient cost", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(data: z.infer<typeof profileIngredientCostSchema>) {
    console.log(data);
    await mutation.mutateAsync({
      input: {
        profileId: profile.id,
        ingredientId: data.ingredient.id,
        mode: data.mode,
        literalCost: data.literalCost,
        literalCostUnitId: data.literalCostUnit?.id,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <IngredientCostForm form={form} />
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

function AddIngredientCostDialog() {
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
            <span>Add Ingredient Cost</span>
          </DialogTitle>
          <DialogDescription>
            Add a ingredient cost to specify the energy composition of a
            specific ingredient.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AddIngredientCostDialogContent onSave={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditIngredientCostDialogContent({
  ingredientCost,
  onSave,
}: {
  ingredientCost: ProfileIngredientCost;
  onSave: () => void;
}) {
  const form = useForm<z.infer<typeof profileIngredientCostSchema>>({
    resolver: zodResolver(profileIngredientCostSchema),
    defaultValues: {
      id: ingredientCost.id,
      ingredient: {
        id: ingredientCost.ingredient.id,
        data: ingredientCost.ingredient,
      },
      mode: ingredientCost.mode,
      literalCost: ingredientCost.literalCost ?? undefined,
      literalCostUnit: ingredientCost.literalCostUnit
        ? {
            id: ingredientCost.literalCostUnit?.id,
            data: ingredientCost.literalCostUnit,
          }
        : undefined,
    },
  });
  const updateProfileIngredientCost = useGraphQLMutation(
    updateProfileIngredientCostMutation
  );
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...updateProfileIngredientCost,
    onSuccess: () => {
      toast("Successfully updated ingredient cost", {
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update ingredient cost", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(data: z.infer<typeof profileIngredientCostSchema>) {
    await mutation.mutateAsync({
      input: {
        id: ingredientCost.id,
        ingredientId: data.ingredient.id,
        mode: data.mode,
        literalCost: data.literalCost ?? null,
        literalCostUnitId: data.literalCostUnit?.id ?? null,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <IngredientCostForm form={form} />
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

function EditIngredientCostDialog({
  ingredientCost,
  onSave,
}: {
  ingredientCost: ProfileIngredientCost;
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
            <span>Edit Ingredient Cost</span>
          </DialogTitle>
          <DialogDescription>
            Modify the ingredient cost to specify the energy content of a
            specific ingredient.
          </DialogDescription>
        </DialogHeader>
        <div>
          <EditIngredientCostDialogContent
            ingredientCost={ingredientCost}
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

function DeleteIngredientCostAlertDialogActions({
  ingredientCost,
}: {
  ingredientCost: ProfileIngredientCost;
}) {
  const deleteProfileIngredientCost = useGraphQLMutation(
    deleteProfileIngredientCostMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...deleteProfileIngredientCost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully deleted ingredient cost", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete ingredient cost", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });

  async function onDelete() {
    await mutation.mutateAsync({
      input: {
        ids: [ingredientCost.id],
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

function DeleteIngredientCostAlertDialog({
  ingredientCost,
}: {
  ingredientCost: ProfileIngredientCost;
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
            <span>Delete Ingredient Cost</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this ingredient cost?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <DeleteIngredientCostAlertDialogActions
            ingredientCost={ingredientCost}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function IngredientCost({
  ingredientCost,
}: {
  ingredientCost: ProfileIngredientCost;
}) {
  const [open, setOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>{ingredientCost.ingredient.name}</TableCell>
      <TableCell className="text-right">
        {ingredientCost.mode === IngredientCostMode.Literal &&
          ingredientCost.literalCost != null && (
            <span>
              {ingredientCost.literalCost}{" "}
              {ingredientCost.literalCostUnit?.symbol}
            </span>
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
            <EditIngredientCostDialog
              onSave={() => setOpen(false)}
              ingredientCost={ingredientCost}
            />
            <DeleteIngredientCostAlertDialog ingredientCost={ingredientCost} />
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
}

export function IngredientCosts() {
  const { profile } = useProfile();

  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-2">
          <div className="flex-1 space-y-1">
            <CardTitle>Ingredient Costs</CardTitle>
            <CardDescription>
              Set the ingredient composition of ingredients used in diets.
            </CardDescription>
          </div>
          <AddIngredientCostDialog />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead className="text-right">Values</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.ingredientCosts.map((ingredientCost) => (
              <IngredientCost
                key={ingredientCost.id}
                ingredientCost={ingredientCost}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
