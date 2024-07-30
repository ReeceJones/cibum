"use client";

import { Button, ButtonProps } from "@/components/ui/button";
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
  getAllNutrientsKey,
  getAllNutrientsQuery,
} from "@/lib/queries/get-all-nutrients";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import {
  IconCategory,
  IconChevronRight,
  IconDeviceFloppy,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconTestPipe,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  forwardRef,
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
  nutrientCategorySchema,
  nutrientFormSchema,
  nutrientSchema,
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
import { GetAllNutrientsAndCategoriesQuery } from "@/lib/gql/graphql";
import { toast } from "sonner";
import { createNutrientMutation } from "@/lib/mutations/create-nutrient";
import { updateNutrientMutation } from "@/lib/mutations/update-nutrient";
import { updateNutrientCategoryMutation } from "@/lib/mutations/update-nutrient-category";
import { createNutrientCategoryMutation } from "@/lib/mutations/create-nutrient-category";
import { deleteNutrientCategoryMutation } from "@/lib/mutations/delete-nutrient-category";
import { deleteNutrientMutation } from "@/lib/mutations/delete-nutrient";

type NutrientTreeNode = {
  type: "nutrient" | "category";
  name: string;
  index: number;
  id: string;
};

type NutrientTableFormContextType = {
  form: UseFormReturn<z.infer<typeof nutrientFormSchema>>;
  index: Map<string, Array<NutrientTreeNode>>;
  setIndex: React.Dispatch<
    React.SetStateAction<Map<string, Array<NutrientTreeNode>>>
  >;
};

const NutrientTableFormContext = createContext<
  NutrientTableFormContextType | undefined
>(undefined);

function useNutrientTableForm() {
  const context = useContext(NutrientTableFormContext);
  if (context === undefined) {
    throw new Error(
      "useNutrientTableForm must be used within a NutrientTableFormProvider"
    );
  }
  return context;
}

function NutrientForm({
  form,
  onSave,
}: {
  form: UseFormReturn<z.infer<typeof nutrientSchema>>;
  onSave: (changed: z.infer<typeof nutrientSchema>) => Promise<void>;
}) {
  const [disabled, setDisabled] = useState(false);
  const onSubmit = useCallback(
    async (values: z.infer<typeof nutrientSchema>) => {
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

function NutrientCategoryForm({
  form,
  onSave,
}: {
  form: UseFormReturn<z.infer<typeof nutrientCategorySchema>>;
  onSave: (changed: z.infer<typeof nutrientCategorySchema>) => Promise<void>;
}) {
  const [disabled, setDisabled] = useState(false);
  const onSubmit = useCallback(
    async (values: z.infer<typeof nutrientCategorySchema>) => {
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

function EditNutrientDialog({
  node,
  onOpenChange,
}: {
  node: NutrientTreeNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const { form: nutrientTableForm } = useNutrientTableForm();
  const nutrient = useWatch({
    control: nutrientTableForm.control,
    name: `nutrients.${node.index}`,
  });
  const { update } = useFieldArray({
    control: nutrientTableForm.control,
    name: "nutrients",
  });
  const form = useForm<z.infer<typeof nutrientSchema>>({
    resolver: zodResolver(nutrientSchema),
    defaultValues: nutrient,
  });
  const [open, setOpen] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const { mutationFn } = useGraphQLMutation(updateNutrientMutation);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllNutrientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully updated nutrient", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update nutrient", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  useEffect(() => {
    form.reset(nutrient);
  }, [nutrient]);

  const onSave = useCallback(
    async (values: z.infer<typeof nutrientSchema>) => {
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
          <span>Edit Nutrient</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <IconEdit size={22} /> <span>Edit Nutrient</span>
          </DialogTitle>
          <DialogDescription>
            Edit the nutrient name, description, and other details.
          </DialogDescription>
        </DialogHeader>
        <NutrientForm form={form} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

function EditNutrientCategoryDialog({
  node,
  onOpenChange,
}: {
  node: NutrientTreeNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const { form: nutrientTableForm } = useNutrientTableForm();
  const nutrientCategory = useWatch({
    control: nutrientTableForm.control,
    name: `categories.${node.index}`,
  });
  const { update } = useFieldArray({
    control: nutrientTableForm.control,
    name: "categories",
  });
  const form = useForm<z.infer<typeof nutrientCategorySchema>>({
    resolver: zodResolver(nutrientCategorySchema),
    defaultValues: nutrientCategory,
  });
  const [open, setOpen] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const { mutationFn } = useGraphQLMutation(updateNutrientCategoryMutation);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllNutrientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully updated nutrient category", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to update nutrient category", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  useEffect(() => {
    form.reset(nutrientCategory);
  }, [nutrientCategory]);

  const onSave = useCallback(
    async (values: z.infer<typeof nutrientCategorySchema>) => {
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
          <span>Edit Nutrient Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <IconEdit size={22} /> <span>Edit Nutrient Category</span>
          </DialogTitle>
          <DialogDescription>
            Edit the nutrient category name, description, and other details.
          </DialogDescription>
        </DialogHeader>
        <NutrientCategoryForm form={form} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

function AddNutrientDialog({
  nutrientCategoryId,
  onOpenChange,
}: {
  nutrientCategoryId?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const { form: nutrientTableForm } = useNutrientTableForm();
  const { append } = useFieldArray({
    control: nutrientTableForm.control,
    name: "nutrients",
  });
  const form = useForm<z.infer<typeof nutrientSchema>>({
    resolver: zodResolver(nutrientSchema),
    defaultValues: {
      nutrient_category_id: nutrientCategoryId,
      id: crypto.randomUUID(),
      managed: false,
    },
  });
  const [open, setOpen] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const createNutrient = useGraphQLMutation(createNutrientMutation);
  const mutation = useMutation({
    ...createNutrient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllNutrientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully created nutrient", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create nutrient", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  const onSave = useCallback(
    async (values: z.infer<typeof nutrientSchema>) => {
      const result = await mutation.mutateAsync({
        input: {
          name: values.name,
          description: values.description ?? null,
          nutrientCategoryId: values.nutrient_category_id ?? null,
        },
      });
      append({
        ...values,
        id: result.createNutrient.id,
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
          <IconTestPipe size={18} />
          <span>Add Nutrient</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="space-x-3 flex items-center">
            <IconTestPipe size={22} />
            <span>Add Nutrient</span>
          </DialogTitle>
          <DialogDescription>
            Add a new nutrient to the list of available nutrients to use in
            diets.
          </DialogDescription>
        </DialogHeader>
        <NutrientForm form={form} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

function AddNutrientCategoryDialog({
  nutrientCategoryId,
  onOpenChange,
}: {
  nutrientCategoryId?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const { form: nutrientTableForm } = useNutrientTableForm();
  const { append } = useFieldArray({
    control: nutrientTableForm.control,
    name: "categories",
  });
  const form = useForm<z.infer<typeof nutrientCategorySchema>>({
    resolver: zodResolver(nutrientCategorySchema),
    defaultValues: {
      id: crypto.randomUUID(),
      parent_id: nutrientCategoryId,
      managed: false,
    },
  });
  const [open, setOpen] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const createNutrientCategory = useGraphQLMutation(
    createNutrientCategoryMutation
  );
  const mutation = useMutation({
    ...createNutrientCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllNutrientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully created nutrient category", {
        icon: <IconDeviceFloppy size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to create nutrient category", {
        icon: <IconDeviceFloppy size={18} />,
        description: error.message,
      });
    },
  });

  const onSave = useCallback(
    async (values: z.infer<typeof nutrientCategorySchema>) => {
      const result = await mutation.mutateAsync({
        input: {
          name: values.name,
          description: values.description ?? null,
          parentNutrientCategoryId: values.parent_id ?? null,
        },
      });
      append({
        ...values,
        id: result.createNutrientCategory.id,
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
          <span>Add Nutrient Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="space-x-3 flex items-center">
            <IconCategory size={22} />
            <span>Add Nutrient Category</span>
          </DialogTitle>
          <DialogDescription>
            Add a new nutrient category to organize nutrients.
          </DialogDescription>
        </DialogHeader>
        <NutrientCategoryForm form={form} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

function AddNutrientOrCategory({
  nutrientCategoryId,
}: {
  nutrientCategoryId?: string;
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
        <AddNutrientDialog nutrientCategoryId={nutrientCategoryId} />
        <AddNutrientCategoryDialog nutrientCategoryId={nutrientCategoryId} />
      </PopoverContent>
    </Popover>
  );
}

export function NutrientCategoryRow({ node }: { node: NutrientTreeNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { form, index: childIndex } = useNutrientTableForm();
  const { remove: categoryRemove } = useFieldArray({
    control: form.control,
    name: "categories",
  });
  const { remove: nutrientRemove } = useFieldArray({
    control: form.control,
    name: "nutrients",
  });
  const nutrientCategories = useWatch({
    control: form.control,
    name: "categories",
  });
  const nutrientCategory = nutrientCategories[node.index];
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const { mutationFn } = useGraphQLMutation(deleteNutrientCategoryMutation);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllNutrientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully deleted nutrient category", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete nutrient category", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });
  const [deleteDisabled, setDeleteDisabled] = useState(false);

  const removeNutrientCategory = useCallback(async () => {
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
      const nutrientRemoveSet = new Set<number>();
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
            nutrientRemoveSet.add(child.index);
          }
        }
      }

      console.log({
        categoryRemoveSet,
        nutrientRemoveSet,
      });
      // remove the nutrients first
      nutrientRemove(Array.from(nutrientRemoveSet));
      // then remove the categories
      categoryRemove(Array.from(categoryRemoveSet));
    } finally {
      setDeleteDisabled(false);
    }
  }, [nutrientRemove, categoryRemove, node.index, childIndex]);

  if (!nutrientCategory || nutrientCategory.id !== node.id) {
    return null;
  }

  const children = childIndex.get(nutrientCategory.id) ?? [];

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
              <div className="font-medium">{nutrientCategory.name}</div>
            </div>
            <div className="font-medium text-primary/70 col-span-4">
              {nutrientCategory.description}
            </div>
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="xs">
                <IconDotsVertical size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col space-y-1" align="start">
              <EditNutrientCategoryDialog node={node} onOpenChange={setOpen} />
              <AddNutrientDialog
                nutrientCategoryId={nutrientCategory.id}
                onOpenChange={setOpen}
              />
              <AddNutrientCategoryDialog
                nutrientCategoryId={nutrientCategory.id}
                onOpenChange={setOpen}
              />
              {!nutrientCategory.managed && (
                <Button
                  variant="destructive"
                  className="flex space-x-2 items-center"
                  onClick={removeNutrientCategory}
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
            if (childNode.type === "nutrient") {
              return <NutrientRow key={childNode.id} node={childNode} />;
            } else {
              return (
                <NutrientCategoryRow key={childNode.id} node={childNode} />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export function NutrientRow({ node }: { node: NutrientTreeNode }) {
  const { form } = useNutrientTableForm();
  const { remove } = useFieldArray({
    control: form.control,
    name: "nutrients",
  });
  const nutrients = useWatch({
    control: form.control,
    name: "nutrients",
  });
  const nutrient = nutrients[node.index];
  const [open, setOpen] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const { orgId } = useAuth();
  const queryClient = useQueryClient();
  const { mutationFn } = useGraphQLMutation(deleteNutrientMutation);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllNutrientsKey({ orgId: orgId ?? "" }),
      });
      toast("Successfully deleted nutrient", {
        icon: <IconTrash size={18} />,
      });
    },
    onError: (error) => {
      console.error(error);
      toast("Failed to delete nutrient", {
        icon: <IconTrash size={18} />,
        description: error.message,
      });
    },
  });

  const removeNutrient = useCallback(async () => {
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

  if (!nutrient || nutrient.id !== node.id) {
    return null;
  }

  return (
    <div className="flex space-x-2 hover:bg-muted/50 items-center transition-colors p-2 rounded-md">
      <div className="grid grid-cols-5 gap-2 flex-1">
        <div className="flex space-x-2 items-center">
          <IconTestPipe size={16} />
          <p>{nutrient.name}</p>
        </div>
        <p className="text-primary/70 col-span-4">{nutrient.description}</p>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="xs">
            <IconDotsVertical size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col space-y-1" align="start">
          <EditNutrientDialog node={node} onOpenChange={setOpen} />
          {!nutrient.managed && (
            <Button
              variant="destructive"
              className="flex space-x-2 items-center"
              onClick={removeNutrient}
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

function NutrientTableForm({
  data,
}: {
  data: GetAllNutrientsAndCategoriesQuery;
}) {
  const form = useForm<z.infer<typeof nutrientFormSchema>>({
    resolver: zodResolver(nutrientFormSchema),
    defaultValues: {
      categories: data.nutrientCategories.edges
        .map((edge) => edge.node)
        .map((node) => ({
          id: node.id,
          name: node.name,
          description: node.description ?? undefined,
          parent_id: node.parentNutrientCategoryId,
          managed: node.managed,
        })),
      nutrients: data.nutrients.edges
        .map((edge) => edge.node)
        .map((node) => ({
          id: node.id,
          name: node.name,
          description: node.description ?? undefined,
          nutrient_category_id: node.nutrientCategoryId,
          managed: node.managed,
        })),
    },
  });
  const [index, setIndex] = useState<Map<string, Array<NutrientTreeNode>>>(
    new Map()
  );
  const [nutrientsValues, categoriesValues] = useWatch({
    control: form.control,
    name: ["nutrients", "categories"],
  });

  useEffect(() => {
    const newIndex = new Map<string, Array<NutrientTreeNode>>();
    nutrientsValues.forEach((nutrient, i) => {
      const key = nutrient.nutrient_category_id ?? "root";
      const existing = newIndex.get(key) ?? [];
      existing.push({
        type: "nutrient",
        name: nutrient.name,
        index: i,
        id: nutrient.id,
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
  }, [nutrientsValues, categoriesValues, setIndex]);

  const rootNodes = index.get("root") ?? [];

  return (
    <Form {...form}>
      <NutrientTableFormContext.Provider value={{ form, index, setIndex }}>
        <div className="space-y-4">
          <div>
            {rootNodes.map((node) => {
              if (node.type === "nutrient") {
                return <NutrientRow key={node.id} node={node} />;
              } else {
                return <NutrientCategoryRow key={node.id} node={node} />;
              }
            })}
          </div>
          <AddNutrientOrCategory />
        </div>
      </NutrientTableFormContext.Provider>
    </Form>
  );
}

export function NutrientTable() {
  const { orgId, isLoaded } = useAuth();
  const { queryFn } = useGraphQLQuery(getAllNutrientsQuery);
  const { data, status } = useQuery({
    queryFn,
    queryKey: getAllNutrientsKey({ orgId: orgId ?? "" }),
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
      <p className="text-destructive">Error occurred fetching nutrients</p>
    );
  }

  return <NutrientTableForm data={data} />;
}
