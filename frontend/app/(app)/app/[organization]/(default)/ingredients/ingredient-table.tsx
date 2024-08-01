"use client";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGraphQLMutation, useGraphQLQuery } from "@/lib/graphql";
import {
  getAllIngredientsKey,
  getAllIngredientsQuery,
} from "@/lib/queries/get-all-ingredients";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import {
  IconCategory,
  IconChevronRight,
  IconDeviceFloppy,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconSeeding,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useFieldArray,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { ClipLoader } from "react-spinners";
import {
  ingredientCategorySchema,
  ingredientFormSchema,
  ingredientSchema,
} from "./form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GetAllIngredientsAndCategoriesQuery } from "@/lib/gql/graphql";
import { toast } from "sonner";
import { createIngredientMutation } from "@/lib/mutations/create-ingredient";
import { updateIngredientMutation } from "@/lib/mutations/update-ingredient";
import { updateIngredientCategoryMutation } from "@/lib/mutations/update-ingredient-category";
import { createIngredientCategoryMutation } from "@/lib/mutations/create-ingredient-category";
import { deleteIngredientCategoryMutation } from "@/lib/mutations/delete-ingredient-category";
import { deleteIngredientMutation } from "@/lib/mutations/delete-ingredient";

type IngredientTreeNode = {
  type: "ingredient" | "category";
  name: string;
  index: number;
  id: string;
};

type IngredientTableFormContextType = {
  form: UseFormReturn<z.infer<typeof ingredientFormSchema>>;
  index: Map<string, Array<IngredientTreeNode>>;
  setIndex: React.Dispatch<
    React.SetStateAction<Map<string, Array<IngredientTreeNode>>>
  >;
};

const IngredientTableFormContext = createContext<
  IngredientTableFormContextType | undefined
>(undefined);

function useIngredientTableForm() {
  const context = useContext(IngredientTableFormContext);
  if (context === undefined) {
    throw new Error(
      "useIngredientTableForm must be used within a IngredientTableFormProvider"
    );
  }
  return context;
}

function IngredientForm({
  form,
  onSave,
}: {
  form: UseFormReturn<z.infer<typeof ingredientSchema>>;
  onSave: (changed: z.infer<typeof ingredientSchema>) => Promise<void>;
}) {
  const [disabled, setDisabled] = useState(false);
  const onSubmit = useCallback(
    async (values: z.infer<typeof ingredientSchema>) => {
      setDisabled(true);
      try {
        await onSave(values);
      } finally {
        setDisabled(false);
      }
    },
    [onSave, setDisabled]
  );

  return (
    <Form {...form}>
      <div className="space-y-2">
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
        <div className="flex justify-between">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={disabled}
          >
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
}

function IngredientCategoryForm({
  form,
  onSave,
}: {
  form: UseFormReturn<z.infer<typeof ingredientCategorySchema>>;
  onSave: (changed: z.infer<typeof ingredientCategorySchema>) => Promise<void>;
}) {
  const [disabled, setDisabled] = useState(false);
  const onSubmit = useCallback(
    async (values: z.infer<typeof ingredientCategorySchema>) => {
      setDisabled(true);
      try {
        await onSave(values);
      } finally {
        setDisabled(false);
      }
    },
    [onSave]
  );

  return (
    <Form {...form}>
      <div className="space-y-2">
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
        <div className="flex justify-between">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={disabled}
          >
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
}

function EditIngredientDialog({
  node,
  onOpenChange,
}: {
  node: IngredientTreeNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const { form: ingredientTableForm } = useIngredientTableForm();
  const ingredient = useWatch({
    control: ingredientTableForm.control,
    name: `ingredients.${node.index}`,
  });
  const { update } = useFieldArray({
    control: ingredientTableForm.control,
    name: "ingredients",
  });
  const form = useForm<z.infer<typeof ingredientSchema>>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: ingredient,
  });
  const [open, setOpen] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const { mutationFn } = useGraphQLMutation(updateIngredientMutation);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllIngredientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully updated ingredient", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update ingredient", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  useEffect(() => {
    form.reset(ingredient);
  }, [ingredient]);

  const onSave = useCallback(
    async (values: z.infer<typeof ingredientSchema>) => {
      await mutation.mutateAsync({
        input: {
          id: values.id,
          name: values.name,
          description: values.description ?? null,
        },
      });
      update(node.index, values);
      form.reset(values);
      setOpen(false);
      onOpenChange?.(false);
    },
    [update, node.index, setOpen]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        onOpenChange?.(v);
      }}
    >
      <DialogTrigger asChild>
        <Button className="space-x-2 flex items-center">
          <IconEdit size={18} />
          <span>Edit Ingredient</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <IconEdit size={22} /> <span>Edit Ingredient</span>
          </DialogTitle>
          <DialogDescription>
            Edit the ingredient name, description, and other details.
          </DialogDescription>
        </DialogHeader>
        <IngredientForm form={form} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

function EditIngredientCategoryDialog({
  node,
  onOpenChange,
}: {
  node: IngredientTreeNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const { form: ingredientTableForm } = useIngredientTableForm();
  const ingredientCategory = useWatch({
    control: ingredientTableForm.control,
    name: `categories.${node.index}`,
  });
  const { update } = useFieldArray({
    control: ingredientTableForm.control,
    name: "categories",
  });
  const form = useForm<z.infer<typeof ingredientCategorySchema>>({
    resolver: zodResolver(ingredientCategorySchema),
    defaultValues: ingredientCategory,
  });
  const [open, setOpen] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const { mutationFn } = useGraphQLMutation(updateIngredientCategoryMutation);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllIngredientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully updated ingredient category", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update ingredient category", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  useEffect(() => {
    form.reset(ingredientCategory);
  }, [ingredientCategory]);

  const onSave = useCallback(
    async (values: z.infer<typeof ingredientCategorySchema>) => {
      await mutation.mutateAsync({
        input: {
          id: values.id,
          name: values.name,
          description: values.description ?? null,
        },
      });
      update(node.index, values);
      form.reset(values);
      setOpen(false);
      onOpenChange?.(false);
    },
    [update, node.index, setOpen]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        onOpenChange?.(v);
      }}
    >
      <DialogTrigger asChild>
        <Button className="space-x-2 flex items-center">
          <IconEdit size={18} />
          <span>Edit Ingredient Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <IconEdit size={22} /> <span>Edit Ingredient Category</span>
          </DialogTitle>
          <DialogDescription>
            Edit the ingredient category name, description, and other details.
          </DialogDescription>
        </DialogHeader>
        <IngredientCategoryForm form={form} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

function AddIngredientDialog({
  ingredientCategoryId,
  onOpenChange,
}: {
  ingredientCategoryId?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const { form: ingredientTableForm } = useIngredientTableForm();
  const { append } = useFieldArray({
    control: ingredientTableForm.control,
    name: "ingredients",
  });
  const form = useForm<z.infer<typeof ingredientSchema>>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      ingredient_category_id: ingredientCategoryId,
      id: crypto.randomUUID(),
      managed: false,
    },
  });
  const [open, setOpen] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const createIngredient = useGraphQLMutation(createIngredientMutation);
  const mutation = useMutation({
    ...createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllIngredientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully created ingredient", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create ingredient", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  const onSave = useCallback(
    async (values: z.infer<typeof ingredientSchema>) => {
      const result = await mutation.mutateAsync({
        input: {
          name: values.name,
          description: values.description ?? null,
          ingredientCategoryId: values.ingredient_category_id ?? null,
        },
      });
      append({
        ...values,
        id: result.createIngredient.id,
      });
      setOpen(false);
      onOpenChange?.(false);
    },
    [append, setOpen]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        onOpenChange?.(v);
      }}
    >
      <DialogTrigger asChild>
        <Button className="space-x-2 flex items-center">
          <IconSeeding size={18} />
          <span>Add Ingredient</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="space-x-3 flex items-center">
            <IconSeeding size={22} />
            <span>Add Ingredient</span>
          </DialogTitle>
          <DialogDescription>
            Add a new ingredient to the list of available ingredients to use in
            diets.
          </DialogDescription>
        </DialogHeader>
        <IngredientForm form={form} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

function AddIngredientCategoryDialog({
  ingredientCategoryId,
  onOpenChange,
}: {
  ingredientCategoryId?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const { form: ingredientTableForm } = useIngredientTableForm();
  const { append } = useFieldArray({
    control: ingredientTableForm.control,
    name: "categories",
  });
  const form = useForm<z.infer<typeof ingredientCategorySchema>>({
    resolver: zodResolver(ingredientCategorySchema),
    defaultValues: {
      id: crypto.randomUUID(),
      parent_id: ingredientCategoryId,
      managed: false,
    },
  });
  const [open, setOpen] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const createIngredientCategory = useGraphQLMutation(
    createIngredientCategoryMutation
  );
  const mutation = useMutation({
    ...createIngredientCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllIngredientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully created ingredient category", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create ingredient category", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  const onSave = useCallback(
    async (values: z.infer<typeof ingredientCategorySchema>) => {
      const result = await mutation.mutateAsync({
        input: {
          name: values.name,
          description: values.description ?? null,
          parentIngredientCategoryId: values.parent_id ?? null,
        },
      });
      append({
        ...values,
        id: result.createIngredientCategory.id,
      });
      setOpen(false);
      onOpenChange?.(false);
    },
    [append, setOpen]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        onOpenChange?.(v);
      }}
    >
      <DialogTrigger asChild>
        <Button className="space-x-2 flex items-center">
          <IconCategory size={18} />
          <span>Add Ingredient Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="space-x-3 flex items-center">
            <IconCategory size={22} />
            <span>Add Ingredient Category</span>
          </DialogTitle>
          <DialogDescription>
            Add a new ingredient category to organize ingredients.
          </DialogDescription>
        </DialogHeader>
        <IngredientCategoryForm form={form} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

function AddIngredientOrCategory({
  ingredientCategoryId,
}: {
  ingredientCategoryId?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 my-1">
          <IconPlus size={18} />
          <span>Add</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col space-y-1" align="start">
        <AddIngredientDialog ingredientCategoryId={ingredientCategoryId} />
        <AddIngredientCategoryDialog
          ingredientCategoryId={ingredientCategoryId}
        />
      </PopoverContent>
    </Popover>
  );
}

export function IngredientCategoryRow({ node }: { node: IngredientTreeNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { form, index: childIndex } = useIngredientTableForm();
  const { remove: categoryRemove } = useFieldArray({
    control: form.control,
    name: "categories",
  });
  const { remove: ingredientRemove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });
  const ingredientCategories = useWatch({
    control: form.control,
    name: "categories",
  });
  const ingredientCategory = ingredientCategories[node.index];
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const { mutationFn } = useGraphQLMutation(deleteIngredientCategoryMutation);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllIngredientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully deleted ingredient category", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete ingredient category", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });
  const [deleteDisabled, setDeleteDisabled] = useState(false);

  const removeIngredientCategory = useCallback(async () => {
    // request the backend to delete
    setDeleteDisabled(true);
    try {
      await mutation.mutateAsync({
        input: {
          ids: [node.id],
        },
      });

      // remove the category and all its recursive dependencies
      const categoryRemoveSet = new Set<number>();
      const ingredientRemoveSet = new Set<number>();
      const parentSet = new Set<number>();
      const fringeSet = new Set<string>();
      parentSet.add(node.index);
      categoryRemoveSet.add(node.index);
      fringeSet.add(node.id);

      while (fringeSet.size > 0) {
        const next = fringeSet.values().next().value;
        fringeSet.delete(next);
        const children = childIndex.get(next) ?? [];
        console.log({ next, children });
        for (const child of children) {
          if (child.type === "category") {
            categoryRemoveSet.add(child.index);
            fringeSet.add(child.id);
          } else {
            ingredientRemoveSet.add(child.index);
          }
        }
      }

      console.log({
        categoryRemoveSet,
        ingredientRemoveSet,
      });
      // remove the ingredients first
      ingredientRemove(Array.from(ingredientRemoveSet));
      // then remove the categories
      categoryRemove(Array.from(categoryRemoveSet));
    } finally {
      setDeleteDisabled(false);
    }
  }, [ingredientRemove, categoryRemove, node.index, childIndex]);

  if (!ingredientCategory || ingredientCategory.id !== node.id) {
    return null;
  }

  const children = childIndex.get(ingredientCategory.id) ?? [];

  return (
    <div>
      <div className="flex space-x-2 items-center hover:bg-muted/50 transition-colors p-2 rounded-md">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <IconChevronRight
            className={cn(
              "transition-all",
              collapsed ? "rotate-0" : "rotate-90"
            )}
            size={16}
          />
        </Button>
        <div className="flex space-x-2 flex-1 items-center">
          <div className="grid grid-cols-5 flex-1 gap-2">
            <div className="flex space-x-2 items-center">
              <IconCategory size={16} />
              <div className="font-medium">{ingredientCategory.name}</div>
            </div>
            <div className="font-medium text-primary/70 col-span-4">
              {ingredientCategory.description}
            </div>
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="xs">
                <IconDotsVertical size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col space-y-1" align="start">
              <EditIngredientCategoryDialog
                node={node}
                onOpenChange={setOpen}
              />
              <AddIngredientDialog
                ingredientCategoryId={ingredientCategory.id}
                onOpenChange={setOpen}
              />
              <AddIngredientCategoryDialog
                ingredientCategoryId={ingredientCategory.id}
                onOpenChange={setOpen}
              />
              {!ingredientCategory.managed && (
                <Button
                  variant="destructive"
                  className="flex space-x-2 items-center"
                  onClick={removeIngredientCategory}
                  disabled={deleteDisabled}
                >
                  <IconTrash size={18} />
                  <span>Delete</span>
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div
        className={cn(
          "transition-all grid ml-9",
          collapsed
            ? "grid-rows-[0fr] opacity-0"
            : "grid-rows-[1fr] opacity-100"
        )}
      >
        <div className="overflow-hidden">
          {children.map((childNode) => {
            if (childNode.type === "ingredient") {
              return <IngredientRow key={childNode.id} node={childNode} />;
            } else {
              return (
                <IngredientCategoryRow key={childNode.id} node={childNode} />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export function IngredientRow({ node }: { node: IngredientTreeNode }) {
  const { form } = useIngredientTableForm();
  const { remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });
  const ingredients = useWatch({
    control: form.control,
    name: "ingredients",
  });
  const ingredient = ingredients[node.index];
  const [open, setOpen] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const { mutationFn } = useGraphQLMutation(deleteIngredientMutation);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllIngredientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully deleted ingredient", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete ingredient", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });

  const removeIngredient = useCallback(async () => {
    setDeleteDisabled(true);
    try {
      await mutation.mutateAsync({
        input: {
          ids: [node.id],
        },
      });
      remove(node.index);
    } finally {
      setDeleteDisabled(false);
    }
  }, [remove, node.index, node.id]);

  if (!ingredient || ingredient.id !== node.id) {
    return null;
  }

  return (
    <div className="flex space-x-2 hover:bg-muted/50 items-center transition-colors p-2 rounded-md">
      <div className="grid grid-cols-5 gap-2 flex-1">
        <div className="flex space-x-2 items-center">
          <IconSeeding size={16} />
          <p>{ingredient.name}</p>
        </div>
        <p className="text-primary/70 col-span-4">{ingredient.description}</p>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="xs">
            <IconDotsVertical size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col space-y-1" align="start">
          <EditIngredientDialog node={node} onOpenChange={setOpen} />
          {!ingredient.managed && (
            <Button
              variant="destructive"
              className="flex space-x-2 items-center"
              onClick={removeIngredient}
              disabled={deleteDisabled}
            >
              <IconTrash size={18} />
              <span>Delete</span>
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function IngredientTableForm({
  data,
}: {
  data: GetAllIngredientsAndCategoriesQuery;
}) {
  const form = useForm<z.infer<typeof ingredientFormSchema>>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      categories: data.ingredientCategories.edges
        .map((edge) => edge.node)
        .map((node) => ({
          id: node.id,
          name: node.name,
          description: node.description ?? undefined,
          parent_id: node.parentIngredientCategoryId,
          managed: node.managed,
        })),
      ingredients: data.ingredients.edges
        .map((edge) => edge.node)
        .map((node) => ({
          id: node.id,
          name: node.name,
          description: node.description ?? undefined,
          ingredient_category_id: node.ingredientCategoryId,
          managed: node.managed,
        })),
    },
  });
  const [index, setIndex] = useState<Map<string, Array<IngredientTreeNode>>>(
    new Map()
  );
  const [ingredientsValues, categoriesValues] = useWatch({
    control: form.control,
    name: ["ingredients", "categories"],
  });

  useEffect(() => {
    const newIndex = new Map<string, Array<IngredientTreeNode>>();
    ingredientsValues.forEach((ingredient, i) => {
      const key = ingredient.ingredient_category_id ?? "root";
      const existing = newIndex.get(key) ?? [];
      existing.push({
        type: "ingredient",
        name: ingredient.name,
        index: i,
        id: ingredient.id,
      });
      newIndex.set(key, existing);
    });
    categoriesValues.forEach((category, i) => {
      const key = category.parent_id ?? "root";
      const existing = newIndex.get(key) ?? [];
      existing.push({
        type: "category",
        name: category.name,
        index: i,
        id: category.id,
      });
      newIndex.set(key, existing);
    });

    // sort each category by type and then name
    newIndex.forEach((value) => {
      value.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        } else {
          return a.type === "category" ? -1 : 1;
        }
      });
    });

    console.log({ newIndex });

    setIndex(newIndex);
  }, [ingredientsValues, categoriesValues, setIndex]);

  const rootNodes = index.get("root") ?? [];

  return (
    <Form {...form}>
      <IngredientTableFormContext.Provider value={{ form, index, setIndex }}>
        <div className="space-y-4">
          <div>
            {rootNodes.map((node) => {
              if (node.type === "ingredient") {
                return <IngredientRow key={node.id} node={node} />;
              } else {
                return <IngredientCategoryRow key={node.id} node={node} />;
              }
            })}
          </div>
          <AddIngredientOrCategory />
        </div>
      </IngredientTableFormContext.Provider>
    </Form>
  );
}

export function IngredientTable() {
  const { orgId, isLoaded } = useAuth();
  const { queryFn } = useGraphQLQuery(getAllIngredientsQuery);
  const { data, status } = useQuery({
    queryFn,
    queryKey: getAllIngredientsKey({ orgId: orgId ?? "" }),
    enabled: isLoaded,
  });

  if (status === "pending") {
    return (
      <div>
        <ClipLoader size={24} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-destructive">Error occurred fetching ingredients</p>
    );
  }

  return <IngredientTableForm data={data} />;
}
