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
  NutrientConstraintMode,
  ProfileNutrientConstraint,
} from "@/lib/gql/graphql";
import { Button } from "@/components/ui/button";
import {
  Icon123,
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
import { profileNutrientConstraintSchema } from "@/lib/schemas/profiles";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VirtualizedNutrientComboBox } from "@/components/ui/nutrient-combobox";
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
import { createProfileNutrientConstraintMutation } from "@/lib/mutations/create-profile-nutrient-constraint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfileKey } from "@/lib/queries/get-profile";
import { mapOperator } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateProfileNutrientConstraintMutation } from "@/lib/mutations/update-profile-nutrient-constraint";
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
import { deleteProfileNutrientConstraintMutation } from "@/lib/mutations/delete-profile-nutrient-constraint";

function NutrientRuleForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof profileNutrientConstraintSchema>>;
}) {
  const [mode] = useWatch({
    control: form.control,
    name: ["mode"],
  });

  return (
    <div className="space-y-2">
      <div className="flex items-end space-x-2">
        <FormField
          control={form.control}
          name="nutrient"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Nutrient</FormLabel>
              <FormMessage />
              <FormControl>
                <VirtualizedNutrientComboBox
                  required
                  className="w-full"
                  {...field}
                />
              </FormControl>
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
        {mode === NutrientConstraintMode.Literal && (
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
                      <VirtualizedUnitComboBox {...field} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </>
        )}
        {mode === NutrientConstraintMode.Nutrient && (
          <FormField
            control={form.control}
            name="referenceNutrient"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Reference Nutrient</FormLabel>
                <FormMessage />
                <FormControl>
                  <VirtualizedNutrientComboBox
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
                          if (field.value === NutrientConstraintMode.Nutrient) {
                            field.onChange(NutrientConstraintMode.Literal);
                          } else {
                            field.onChange(NutrientConstraintMode.Nutrient);
                          }
                        }}
                      >
                        {field.value === NutrientConstraintMode.Nutrient && (
                          <Icon123 />
                        )}
                        {field.value === NutrientConstraintMode.Literal && (
                          <IconGrowth />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {field.value === NutrientConstraintMode.Nutrient && (
                        <p>Switch to hardcoded-value</p>
                      )}
                      {field.value === NutrientConstraintMode.Literal && (
                        <p>Switch to nutrient comparison</p>
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

function AddNutrientRuleDialogContent({ onSave }: { onSave: () => void }) {
  const form = useForm<z.infer<typeof profileNutrientConstraintSchema>>({
    resolver: zodResolver(profileNutrientConstraintSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      mode: NutrientConstraintMode.Literal,
    },
  });
  const createProfileNutrientConstraint = useGraphQLMutation(
    createProfileNutrientConstraintMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...createProfileNutrientConstraint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully created nutrient rule", {
        icon: <IconDeviceFloppy size={18} />,
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create nutrient rule", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(
    data: z.infer<typeof profileNutrientConstraintSchema>
  ) {
    console.log(data);
    await mutation.mutateAsync({
      input: {
        profileId: profile.id,
        mode: data.mode,
        operator: data.operator,
        nutrientId: data.nutrient.id,
        literalValue: data.literalValue,
        literalUnitId: data.literalUnit?.id,
        referenceNutrientId: data.referenceNutrient?.id,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <NutrientRuleForm form={form} />
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

function AddNutrientRuleDialog() {
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
            <span>Add Nutrient Rule</span>
          </DialogTitle>
          <DialogDescription>
            Add an nutrient rule to control which nutrients are selected when
            formulating diets.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AddNutrientRuleDialogContent onSave={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditNutrientRuleDialogContent({
  nutrientRule,
  onSave,
}: {
  nutrientRule: ProfileNutrientConstraint;
  onSave: () => void;
}) {
  const form = useForm<z.infer<typeof profileNutrientConstraintSchema>>({
    resolver: zodResolver(profileNutrientConstraintSchema),
    defaultValues: {
      id: nutrientRule.id,
      mode: nutrientRule.mode,
      operator: nutrientRule.operator,
      nutrient: {
        id: nutrientRule.nutrient!.id,
        data: nutrientRule.nutrient!,
      },
      literalValue: nutrientRule.literalValue ?? undefined,
      literalUnit: nutrientRule.literalUnit
        ? {
            id: nutrientRule.literalUnit.id,
            data: nutrientRule.literalUnit,
          }
        : undefined,
      referenceNutrient: nutrientRule.referenceNutrient
        ? {
            id: nutrientRule.referenceNutrient.id,
            data: nutrientRule.referenceNutrient,
          }
        : undefined,
    },
  });
  const updateProfileNutrientConstraint = useGraphQLMutation(
    updateProfileNutrientConstraintMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...updateProfileNutrientConstraint,
    onSuccess: () => {
      toast("Successfully updated nutrient rule", {
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update nutrient rule", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  async function onSubmit(
    data: z.infer<typeof profileNutrientConstraintSchema>
  ) {
    await mutation.mutateAsync({
      input: {
        id: nutrientRule.id,
        mode: data.mode,
        operator: data.operator,
        nutrientId: data.nutrient.id,
        literalValue: data.literalValue,
        literalUnitId: data.literalUnit?.id,
        referenceNutrientId: data.referenceNutrient?.id,
      },
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <NutrientRuleForm form={form} />
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

function EditNutrientRuleDialog({
  nutrientRule,
  onSave,
}: {
  nutrientRule: ProfileNutrientConstraint;
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
            <span>Edit Nutrient Rule</span>
          </DialogTitle>
          <DialogDescription>
            Modify the nutrient rule to control which nutrients are selected
            when formulating diets.
          </DialogDescription>
        </DialogHeader>
        <div>
          <EditNutrientRuleDialogContent
            nutrientRule={nutrientRule}
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

function DeleteNutrientRuleAlertDialogActions({
  nutrientRule,
}: {
  nutrientRule: ProfileNutrientConstraint;
}) {
  const deleteProfileNutrientConstraint = useGraphQLMutation(
    deleteProfileNutrientConstraintMutation
  );
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const mutation = useMutation({
    ...deleteProfileNutrientConstraint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileKey({ profileId: profile.id }),
      });
      toast("Successfully deleted nutrient rule", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete nutrient rule", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });
  async function onDelete() {
    await mutation.mutateAsync({
      input: {
        ids: [nutrientRule.id],
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

function DeleteNutrientRuleAlertDialog({
  nutrientRule,
}: {
  nutrientRule: ProfileNutrientConstraint;
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
            <span>Delete Nutrient Rule</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this nutrient rule?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <DeleteNutrientRuleAlertDialogActions nutrientRule={nutrientRule} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function NutrientRule({
  nutrientRule,
}: {
  nutrientRule: ProfileNutrientConstraint;
}) {
  const [open, setOpen] = useState(false);
  return (
    <TableRow>
      <TableCell>{nutrientRule.nutrient!.name}</TableCell>
      <TableCell className="text-center">
        {mapOperator(nutrientRule.operator)}
      </TableCell>
      <TableCell className="text-right">
        {nutrientRule.mode === NutrientConstraintMode.Nutrient &&
          nutrientRule.referenceNutrient!.name}
        {nutrientRule.mode === NutrientConstraintMode.Literal && (
          <span>
            {nutrientRule.literalValue} {nutrientRule.literalUnit!.symbol}
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
            <EditNutrientRuleDialog
              onSave={() => setOpen(false)}
              nutrientRule={nutrientRule}
            />
            <DeleteNutrientRuleAlertDialog nutrientRule={nutrientRule} />
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
}

export function NutrientRules() {
  const { profile } = useProfile();

  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-2">
          <div className="flex-1 space-y-1">
            <CardTitle>Nutrient Rules</CardTitle>
            <CardDescription>
              Control which nutrients can be used when formulating diets with
              this profile.
            </CardDescription>
          </div>
          <AddNutrientRuleDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nutrient</TableHead>
                <TableHead className="text-center">Comparison</TableHead>
                <TableHead className="text-right">Reference Value</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.nutrientConstraints.map((nutrientRule) => (
                <NutrientRule
                  key={nutrientRule.id}
                  nutrientRule={nutrientRule}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
