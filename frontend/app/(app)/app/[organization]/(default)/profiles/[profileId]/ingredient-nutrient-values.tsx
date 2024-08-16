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
import { createProfileIngredientNutrientValueMutation } from "@/lib/mutations/create-profile-ingredient-nutrient-value";
import { profileIngredientNutrientValueSchema } from "@/lib/schemas/profiles";
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
import { VirtualizedNutrientComboBox } from "@/components/ui/nutrient-combobox";
import { Input } from "@/components/ui/input";
import { VirtualizedUnitComboBox } from "@/components/ui/unit-combobox";
import { ProfileIngredientNutrientValue, UnitType } from "@/lib/gql/graphql";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateProfileIngredientNutrientValueMutation } from "@/lib/mutations/update-profile-ingredient-nutrient-value";
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
import { deleteProfileIngredientNutrientValueMutation } from "@/lib/mutations/delete-profile-ingredient-nutrient-value";

function IngredientNutrientValueForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof profileIngredientNutrientValueSchema>>;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="ingredient"
          render={({ field }) => (
            <FormItem>
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
        <FormField
          control={form.control}
          name="nutrient"
          render={({ field }) => (
            <FormItem>
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
      </div>
      <div className="flex justify-end space-x-2">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Ingredient</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Value"
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormMessage />
              <div className="w-full">
                <FormControl>
                  <VirtualizedUnitComboBox
                    type={UnitType.Concentration}
                    required
                    {...field}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function AddIngredientNutrientValueDialogContent({
  onSave,
}: {
  onSave: () => void;
}) {
  const form = useForm<z.infer<typeof profileIngredientNutrientValueSchema>>({
    resolver: zodResolver(profileIngredientNutrientValueSchema),
    defaultValues: {
      id: crypto.randomUUID(),
    },
  });
  const createProfileIngredientNutrientValue = useGraphQLMutation(
    createProfileIngredientNutrientValueMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...createProfileIngredientNutrientValue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully created ingredient nutrient value", {
        icon: <IconDeviceFloppy size={18} />,
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create ingredient nutrient value", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(
    data: z.infer<typeof profileIngredientNutrientValueSchema>
  ) {
    console.log(data);
    await mutation.mutateAsync({
      input: {
        profileId: profile.id,
        ingredientId: data.ingredient.id,
        nutrientId: data.nutrient.id,
        unitId: data.unit.id,
        value: data.value,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <IngredientNutrientValueForm form={form} />
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

function AddIngredientNutrientValueDialog() {
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
            <span>Add Ingredient Nutrient Value</span>
          </DialogTitle>
          <DialogDescription>
            Add a nutrient value to a specific ingredient to specify nutrient
            composition of ingredients.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AddIngredientNutrientValueDialogContent
            onSave={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditIngredientNutrientValueDialogContent({
  ingredientNutrientValue,
  onSave,
}: {
  ingredientNutrientValue: ProfileIngredientNutrientValue;
  onSave: () => void;
}) {
  const form = useForm<z.infer<typeof profileIngredientNutrientValueSchema>>({
    resolver: zodResolver(profileIngredientNutrientValueSchema),
    defaultValues: {
      id: ingredientNutrientValue.id,
      ingredient: {
        id: ingredientNutrientValue.ingredient.id,
        data: ingredientNutrientValue.ingredient,
      },
      nutrient: {
        id: ingredientNutrientValue.nutrient.id,
        data: ingredientNutrientValue.nutrient,
      },
      value: ingredientNutrientValue.value,
      unit: {
        id: ingredientNutrientValue.unit.id,
        data: ingredientNutrientValue.unit,
      },
    },
  });
  const updateProfileIngredientNutrientValue = useGraphQLMutation(
    updateProfileIngredientNutrientValueMutation
  );
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...updateProfileIngredientNutrientValue,
    onSuccess: () => {
      toast("Successfully updated ingredient nutrient value", {
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update ingredient nutrient value", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(
    data: z.infer<typeof profileIngredientNutrientValueSchema>
  ) {
    await mutation.mutateAsync({
      input: {
        id: ingredientNutrientValue.id,
        value: data.value,
        unitId: data.unit.id,
        ingredientId: data.ingredient.id,
        nutrientId: data.nutrient.id,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <IngredientNutrientValueForm form={form} />
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

function EditIngredientNutrientValueDialog({
  ingredientNutrientValue,
  onSave,
}: {
  ingredientNutrientValue: ProfileIngredientNutrientValue;
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
            <span>Edit Ingredient Nutrient Value</span>
          </DialogTitle>
          <DialogDescription>
            Modify the ingredient nutrient value to specify the composition of a
            specific ingredient.
          </DialogDescription>
        </DialogHeader>
        <div>
          <EditIngredientNutrientValueDialogContent
            ingredientNutrientValue={ingredientNutrientValue}
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

function DeleteIngredientNutrientValueAlertDialogActions({
  ingredientNutrientValue,
}: {
  ingredientNutrientValue: ProfileIngredientNutrientValue;
}) {
  const deleteProfileIngredientNutrientValue = useGraphQLMutation(
    deleteProfileIngredientNutrientValueMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...deleteProfileIngredientNutrientValue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully deleted ingredient nutrient value", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete ingredient nutrient value", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });

  async function onDelete() {
    await mutation.mutateAsync({
      input: {
        ids: [ingredientNutrientValue.id],
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

function DeleteIngredientNutrientValueAlertDialog({
  ingredientNutrientValue,
}: {
  ingredientNutrientValue: ProfileIngredientNutrientValue;
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
            <span>Delete Ingredient Nutrient Value</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this ingredient nutrient value?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <DeleteIngredientNutrientValueAlertDialogActions
            ingredientNutrientValue={ingredientNutrientValue}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function IngredientNutrientValue({
  ingredientNutrientValue,
}: {
  ingredientNutrientValue: ProfileIngredientNutrientValue;
}) {
  const [open, setOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>{ingredientNutrientValue.ingredient.name}</TableCell>
      <TableCell>{ingredientNutrientValue.nutrient.name}</TableCell>
      <TableCell className="text-right">
        {ingredientNutrientValue.value} {ingredientNutrientValue.unit.symbol}
      </TableCell>
      <TableCell className="w-10">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="xs">
              <IconDotsVertical size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="space-y-1">
            <EditIngredientNutrientValueDialog
              onSave={() => setOpen(false)}
              ingredientNutrientValue={ingredientNutrientValue}
            />
            <DeleteIngredientNutrientValueAlertDialog
              ingredientNutrientValue={ingredientNutrientValue}
            />
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
}

export function IngredientNutrientValues() {
  const { profile } = useProfile();

  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-2">
          <div className="flex-1 space-y-1">
            <CardTitle>Ingredient Nutrient Values</CardTitle>
            <CardDescription>
              Set the nutrient composition of ingredients used in diets.
            </CardDescription>
          </div>
          <AddIngredientNutrientValueDialog />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead>Nutrient</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.ingredientNutrientValues.map((ingredientNutrientValue) => (
              <IngredientNutrientValue
                key={ingredientNutrientValue.id}
                ingredientNutrientValue={ingredientNutrientValue}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
