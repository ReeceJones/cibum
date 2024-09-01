"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProfile } from "./use-profile";
import {
  ConstraintOperator,
  IngredientConstraintMode,
  IngredientConstraintType,
  ProfileIngredientConstraint,
  UnitType,
} from "@/lib/gql/graphql";
import { Button } from "@/components/ui/button";
import {
  Icon123,
  IconCategory,
  IconDeviceFloppy,
  IconDotsVertical,
  IconEdit,
  IconGrowth,
  IconSquareRoundedPlus,
  IconTrash,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { profileIngredientConstraintSchema } from "@/lib/schemas/profiles";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VirtualizedIngredientComboBox } from "@/components/ui/ingredient-combobox";
import { VirtualizedUnitComboBox } from "@/components/ui/unit-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGraphQLMutation } from "@/lib/graphql";
import { createProfileIngredientConstraintMutation } from "@/lib/mutations/create-profile-ingredient-constraint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfileKey } from "@/lib/queries/get-profile";
import { mapOperator } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateProfileIngredientConstraintMutation } from "@/lib/mutations/update-profile-ingredient-constraint";
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
import { deleteProfileIngredientConstraintMutation } from "@/lib/mutations/delete-profile-ingredient-constraint";
import { Switch } from "@/components/ui/switch";
import { VirtualizedIngredientCategoryComboBox } from "@/components/ui/ingredient-category-combobox";
import * as uuid from "uuid";

function IngredientRuleForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof profileIngredientConstraintSchema>>;
}) {
  const [mode, type] = useWatch({
    control: form.control,
    name: ["mode", "type"],
  });

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <div className="border rounded-md p-3 flex justify-between items-center">
              <div>
                <FormLabel>Ingredient Category</FormLabel>
                <FormDescription>
                  Apply this rule to an entire ingredient category.
                </FormDescription>
              </div>
              <div>
                <Switch
                  checked={
                    field.value === IngredientConstraintType.IngredientCategory
                  }
                  onCheckedChange={(v) => {
                    if (v) {
                      field.onChange(
                        IngredientConstraintType.IngredientCategory
                      );
                    } else {
                      field.onChange(IngredientConstraintType.Ingredient);
                    }
                  }}
                />
              </div>
            </div>
          </FormItem>
        )}
      />
      <div className="flex items-end space-x-2">
        {type === IngredientConstraintType.Ingredient && (
          <FormField
            control={form.control}
            name="ingredient"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Ingredient</FormLabel>
                <FormMessage />
                <FormControl>
                  <VirtualizedIngredientComboBox
                    className="w-full"
                    required
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        {type === IngredientConstraintType.IngredientCategory && (
          <FormField
            control={form.control}
            name="ingredientCategory"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Ingredient Category</FormLabel>
                <FormMessage />
                <FormControl>
                  <VirtualizedIngredientCategoryComboBox
                    className="w-full"
                    required
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
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
        {mode === IngredientConstraintMode.Literal && (
          <>
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
                      placeholder="Value"
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
                  <div className="w-full">
                    <FormControl>
                      <VirtualizedUnitComboBox
                        type={UnitType.Concentration}
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </>
        )}
        {mode === IngredientConstraintMode.Reference &&
          type === IngredientConstraintType.Ingredient && (
            <FormField
              control={form.control}
              name="referenceIngredient"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Reference Ingredient</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <VirtualizedIngredientComboBox
                      required
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        {mode === IngredientConstraintMode.Reference &&
          type === IngredientConstraintType.IngredientCategory && (
            <FormField
              control={form.control}
              name="referenceIngredientCategory"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Reference Ingredient Category</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <VirtualizedIngredientCategoryComboBox
                      required
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormMessage />
              <FormControl>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger>
                      <Button
                        variant="outline"
                        className="w-10 p-0"
                        onClick={() => {
                          if (
                            field.value === IngredientConstraintMode.Reference
                          ) {
                            field.onChange(IngredientConstraintMode.Literal);
                          } else {
                            field.onChange(IngredientConstraintMode.Reference);
                          }
                        }}
                      >
                        {field.value === IngredientConstraintMode.Reference && (
                          <Icon123 />
                        )}
                        {field.value === IngredientConstraintMode.Literal &&
                          type === IngredientConstraintType.Ingredient && (
                            <IconGrowth />
                          )}
                        {field.value === IngredientConstraintMode.Literal &&
                          type ===
                            IngredientConstraintType.IngredientCategory && (
                            <IconCategory />
                          )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {field.value === IngredientConstraintMode.Reference && (
                        <p>Switch to hardcoded-value</p>
                      )}
                      {field.value === IngredientConstraintMode.Literal &&
                        type === IngredientConstraintType.Ingredient && (
                          <p>Switch to ingredient comparison</p>
                        )}
                      {field.value === IngredientConstraintMode.Literal &&
                        type ===
                          IngredientConstraintType.IngredientCategory && (
                          <p>Switch to ingredient category comparison</p>
                        )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function AddIngredientRuleDialogContent({ onSave }: { onSave: () => void }) {
  const form = useForm<z.infer<typeof profileIngredientConstraintSchema>>({
    resolver: zodResolver(profileIngredientConstraintSchema),
    defaultValues: {
      id: uuid.v4(),
      type: IngredientConstraintType.Ingredient,
      mode: IngredientConstraintMode.Literal,
    },
  });
  const createProfileIngredientConstraint = useGraphQLMutation(
    createProfileIngredientConstraintMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...createProfileIngredientConstraint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully created ingredient rule", {
        icon: <IconDeviceFloppy size={18} />,
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create ingredient rule", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(
    data: z.infer<typeof profileIngredientConstraintSchema>
  ) {
    console.log(data);
    await mutation.mutateAsync({
      input: {
        profileId: profile.id,
        type: data.type,
        mode: data.mode,
        operator: data.operator,
        ingredientId: data.ingredient?.id,
        ingredientCategoryId: data.ingredientCategory?.id,
        literalValue: data.literalValue,
        literalUnitId: data.literalUnit?.id ?? null,
        referenceIngredientId: data.referenceIngredient?.id ?? null,
        referenceIngredientCategoryId:
          data.referenceIngredientCategory?.id ?? null,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <IngredientRuleForm form={form} />
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

function AddIngredientRuleDialog() {
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
            <span>Add Ingredient Rule</span>
          </DialogTitle>
          <DialogDescription>
            Add an ingredient rule to control which ingredients are selected
            when formulating diets.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AddIngredientRuleDialogContent onSave={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditIngredientRuleDialogContent({
  ingredientRule,
  onSave,
}: {
  ingredientRule: ProfileIngredientConstraint;
  onSave: () => void;
}) {
  const form = useForm<z.infer<typeof profileIngredientConstraintSchema>>({
    resolver: zodResolver(profileIngredientConstraintSchema),
    defaultValues: {
      id: ingredientRule.id,
      type: ingredientRule.type,
      mode: ingredientRule.mode,
      operator: ingredientRule.operator,
      ingredient: ingredientRule.ingredient
        ? {
            id: ingredientRule.ingredient.id,
            data: ingredientRule.ingredient,
          }
        : undefined,
      ingredientCategory: ingredientRule.ingredientCategory
        ? {
            id: ingredientRule.ingredientCategory.id,
            data: ingredientRule.ingredientCategory,
          }
        : undefined,
      literalValue: ingredientRule.literalValue ?? undefined,
      literalUnit: ingredientRule.literalUnit
        ? {
            id: ingredientRule.literalUnit.id,
            data: ingredientRule.literalUnit,
          }
        : undefined,
      referenceIngredient: ingredientRule.referenceIngredient
        ? {
            id: ingredientRule.referenceIngredient.id,
            data: ingredientRule.referenceIngredient,
          }
        : undefined,
    },
  });
  const updateProfileIngredientConstraint = useGraphQLMutation(
    updateProfileIngredientConstraintMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...updateProfileIngredientConstraint,
    onSuccess: () => {
      toast("Successfully updated ingredient rule", {
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update ingredient rule", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(
    data: z.infer<typeof profileIngredientConstraintSchema>
  ) {
    await mutation.mutateAsync({
      input: {
        id: ingredientRule.id,
        type: data.type,
        mode: data.mode,
        operator: data.operator,
        ingredientId: data.ingredient?.id ?? null,
        ingredientCategoryId: data.ingredientCategory?.id ?? null,
        literalValue: data.literalValue,
        literalUnitId: data.literalUnit?.id,
        referenceIngredientId: data.referenceIngredient?.id ?? null,
        referenceIngredientCategoryId: data.referenceIngredientCategory ?? null,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <IngredientRuleForm form={form} />
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

function EditIngredientRuleDialog({
  ingredientRule,
  onSave,
}: {
  ingredientRule: ProfileIngredientConstraint;
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
            <span>Edit Ingredient Rule</span>
          </DialogTitle>
          <DialogDescription>
            Modify the ingredient rule to control which ingredients are selected
            when formulating diets.
          </DialogDescription>
        </DialogHeader>
        <div>
          <EditIngredientRuleDialogContent
            ingredientRule={ingredientRule}
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

function DeleteIngredientRuleAlertDialogActions({
  ingredientRule,
}: {
  ingredientRule: ProfileIngredientConstraint;
}) {
  const deleteProfileIngredientConstraint = useGraphQLMutation(
    deleteProfileIngredientConstraintMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...deleteProfileIngredientConstraint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully deleted ingredient rule", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete ingredient rule", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });
  async function onDelete() {
    await mutation.mutateAsync({
      input: {
        ids: [ingredientRule.id],
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

function DeleteIngredientRuleAlertDialog({
  ingredientRule,
}: {
  ingredientRule: ProfileIngredientConstraint;
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
            <span>Delete Ingredient Rule</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this ingredient rule?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <DeleteIngredientRuleAlertDialogActions
            ingredientRule={ingredientRule}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function IngredientRule({
  ingredientRule,
}: {
  ingredientRule: ProfileIngredientConstraint;
}) {
  const [open, setOpen] = useState(false);
  return (
    <TableRow>
      <TableCell>
        {ingredientRule.type === IngredientConstraintType.Ingredient
          ? ingredientRule.ingredient!.name
          : ingredientRule.ingredientCategory!.name}
      </TableCell>
      <TableCell className="text-center">
        {mapOperator(ingredientRule.operator)}
      </TableCell>
      <TableCell className="text-right">
        {ingredientRule.mode === IngredientConstraintMode.Reference &&
          (ingredientRule.type === IngredientConstraintType.Ingredient
            ? ingredientRule.referenceIngredient!.name
            : ingredientRule.referenceIngredientCategory!.name)}
        {ingredientRule.mode === IngredientConstraintMode.Literal && (
          <span>
            {ingredientRule.literalValue} {ingredientRule.literalUnit!.symbol}
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
            <EditIngredientRuleDialog
              onSave={() => setOpen(false)}
              ingredientRule={ingredientRule}
            />
            <DeleteIngredientRuleAlertDialog ingredientRule={ingredientRule} />
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
}

export function IngredientRules() {
  const { profile } = useProfile();

  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-2">
          <div className="flex-1 space-y-1">
            <CardTitle>Ingredient Rules</CardTitle>
            <CardDescription>
              Control which ingredients can be used when formulating diets with
              this profile.
            </CardDescription>
          </div>
          <AddIngredientRuleDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead className="text-center">Comparison</TableHead>
                <TableHead className="text-right">Reference Value</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.ingredientConstraints.map((ingredientRule) => (
                <IngredientRule
                  key={ingredientRule.id}
                  ingredientRule={ingredientRule}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
