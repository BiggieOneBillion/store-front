"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type React from "react"; // Import React

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
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
import { useProduct } from "@/hooks/useProduct";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/services/api/categories";

interface Category {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
}

const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"),
  sku: z.string().min(1, "SKU is required"),
});

const specificationSchema = z.object({
  name: z.string(),
  value: z.string(),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be a positive number"),
  tag: z.enum(["latest", "featured", "regular", "sale"]).default("regular"),
  compareAtPrice: z
    .number()
    .min(0, "Compare at price must be a positive number")
    .optional(),
  //   images: z.array(z.string().url("Invalid image URL")),
  imageFiles: z.array(z.instanceof(File)),
  inventory: z.object({
    quantity: z
      .number()
      .int()
      .min(0, "Quantity must be a non-negative integer"),
    sku: z.string().min(1, "SKU is required"),
    lowStockThreshold: z
      .number()
      .int()
      .min(0, "Low stock threshold must be a non-negative integer")
      .default(5),
  }),
  variants: z.array(variantSchema).optional(),
  specifications: z.array(specificationSchema).optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]).default("active"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

type Props = {
  data: Partial<ProductFormValues> & { categoryId: string };
  productId: string;
};

export function EditProductForm({ data, productId }: Props) {
  const [variants, setVariants] = useState<z.infer<typeof variantSchema>[]>(
    data.variants!
  );
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(
    null
  );

  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...data,
      imageFiles: [],
      tag: data?.tag!,
    },
  });

  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  const variantForm = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      sku: "",
    },
  });

  const { updateProductFn, updateProductError, isUpdatingProduct } =
    useProduct();

  const { user } = useUserStore();

  async function onSubmit(values: ProductFormValues) {
    const productData = { ...values, variants };

    let categoryValue: string;

    if (productData.category !== data.category) {
      categoryValue = productData.category;
    } else {
      categoryValue = data.categoryId!;
      console.log(categoryValue);
    }

    const input = {
      name: productData.name,
      description: productData.description,
      category: categoryValue,
      price: productData.price,
      tag: productData.tag,
      compareAtPrice: productData.compareAtPrice,
      images: [productData.imageFiles[0]],
      inventory: {
        quantity: productData.inventory.quantity,
        sku: productData.inventory.sku,
        lowStockThreshold: productData.inventory.lowStockThreshold,
      },
      variants: productData.variants.map((el) => ({
        name: el.name,
        price: el.price,
        quantity: el.quantity,
        sku: el.sku,
      })),
      specifications: productData.specifications?.map((el) => ({
        name: el.name,
        value: el.value,
      })),
    };

    console.log(input);

    try {
      await updateProductFn({
        token: user?.token!,
        userId: user?.id!,
        data: input,
        productId,
      });
      toast.success("Update Successful");
      queryClient.invalidateQueries({ queryKey: ["store-products"] });
    } catch (error) {
      toast.error("Failed to create product", {
        description: updateProductError?.message,
      });
    }
  }

  function onVariantSubmit(
    data: z.infer<typeof variantSchema>,
    event: React.BaseSyntheticEvent | undefined
  ) {
    if (event) {
      event.preventDefault();
    }
    if (editingVariantIndex !== null) {
      const updatedVariants = [...variants];
      updatedVariants[editingVariantIndex] = data;
      setVariants(updatedVariants);
      setEditingVariantIndex(null);
    } else {
      setVariants([...variants, data]);
    }
    variantForm.reset();
  }

  function editVariant(index: number) {
    if (variantForm.formState.isDirty) {
      if (
        confirm(
          "You have unsaved changes. Do you want to discard them and edit this variant?"
        )
      ) {
        setEditingVariantIndex(index);
        variantForm.reset(variants[index]);
      }
    } else {
      setEditingVariantIndex(index);
      variantForm.reset(variants[index]);
    }
  }

  function deleteVariant(index: number) {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
    if (editingVariantIndex === index) {
      setEditingVariantIndex(null);
      variantForm.reset();
    }
  }

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories({ token: user?.token! });
      return res.results;
    },
  });

  console.log(data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[80vh] px-2 overflow-y-scroll"
      >
        <div className="space-y-6">
          {/* Basic Information section */}
          <div>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
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
                      <Textarea
                        placeholder="Enter product description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isCategoriesLoading && <p>Loading categories...</p>}

              {/* {categories && categories.length > 0 && ( */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center  gap-2">
                        <p>Category</p>
                        <span className="ml-auto text-xs text-gray-600 underline">
                          previous value
                        </span>
                        <span className="text-sm bg-teal-700 px-1 text-white rounded">
                          {data.category}
                        </span>
                      </div>
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isCategoriesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={"Select your category"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isCategoriesLoading ? (
                          <SelectItem value="Loading categories">
                            Loading categories...
                          </SelectItem>
                        ) : categories.length === 0 ? (
                          <SelectItem value="">
                            No categories available
                          </SelectItem>
                        ) : (
                          categories &&
                          Array.isArray(categories) &&
                          categories
                            .filter((category) => category.status === "active")
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a category for your product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* )} */}
              {/* <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center  gap-2">
                        <p>Product Tag</p>
                        <span className="ml-auto text-xs text-gray-600 underline">
                          previous value
                        </span>
                        <span className="text-sm bg-teal-700 capitalize px-1 text-white rounded">
                          {data.tag}
                        </span>
                      </div>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={data.tag}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={"Select Product Tag"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="sale">Sale</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Pricing section */}
          <div>
            <h3 className="text-lg font-medium">Pricing</h3>
            <div className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare at Price (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter compare at price"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Inventory section */}
          <div>
            <h3 className="text-lg font-medium">Inventory</h3>
            <div className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="inventory.quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inventory.sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inventory.lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter low stock threshold"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>Default is 5</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <section className="space-y-6 md:hidden">
            {/* Images section */}
            <div>
              <h3 className="text-lg font-medium">Images</h3>
              <div className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="imageFiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Images</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const validFiles = files.filter(
                              (file) => file.size <= 2 * 1024 * 1024
                            );
                            if (validFiles.length !== files.length) {
                              alert(
                                "Some files were not added because they exceed the 2MB size limit."
                              );
                            }
                            field.onChange(validFiles);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Max file size: 2MB per image. You can select multiple
                        files.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("imageFiles").length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {form.watch("imageFiles").map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1"
                          onClick={() => {
                            const newFiles = [...form.getValues("imageFiles")];
                            newFiles.splice(index, 1);
                            form.setValue("imageFiles", newFiles);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Variants section */}
            <div>
              <h3 className="text-lg font-medium">Variants</h3>
              <div className="space-y-4 mt-4">
                {variants.map((variant, index) => (
                  <Card key={index}>
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <p className="font-medium">{variant.name}</p>
                        <p className="text-sm text-gray-500">
                          Price: ${variant.price} | Quantity: {variant.quantity}{" "}
                          | SKU: {variant.sku}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            editVariant(index);
                          }}
                          aria-label={`Edit ${variant.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <span
                              className=" h-full flex items-center justify-center border py-[9px] px-2 rounded-sm shadow-sm"
                              aria-label={`Delete ${variant.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </span>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the variant.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteVariant(index)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardContent className="p-4">
                    <Form {...variantForm}>
                      <div className="space-y-4">
                        <FormField
                          control={variantForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Variant Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter variant name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={variantForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter price"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseFloat(e.target.value)
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={variantForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter quantity"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={variantForm.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter SKU" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          onClick={variantForm.handleSubmit(onVariantSubmit)}
                        >
                          {editingVariantIndex !== null
                            ? "Update Variant"
                            : "Add Variant"}
                        </Button>
                      </div>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Specifications section */}
            <div>
              <h3 className="text-lg font-medium">Specifications</h3>
              <div className="space-y-4 mt-4">
                {specificationFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`specifications.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{index === 0 ? "Name" : ""}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Specification name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`specifications.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{index === 0 ? "Value" : ""}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Specification value"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSpecification({ name: "", value: "" })}
                >
                  Add Specification
                </Button>
              </div>
            </div>

            {/* Status section */}
            <div>
              <h3 className="text-lg font-medium">Status</h3>
              <div className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="out_of_stock">
                            Out of Stock
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6 hidden md:block">
          {/* Images section */}
          <div>
            <h3 className="text-lg font-medium">Images</h3>
            <div className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="imageFiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Images</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const validFiles = files.filter(
                            (file) => file.size <= 2 * 1024 * 1024
                          );
                          if (validFiles.length !== files.length) {
                            alert(
                              "Some files were not added because they exceed the 2MB size limit."
                            );
                          }
                          field.onChange(validFiles);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Max file size: 2MB per image. You can select multiple
                      files.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("imageFiles").length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {form.watch("imageFiles").map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1"
                        onClick={() => {
                          const newFiles = [...form.getValues("imageFiles")];
                          newFiles.splice(index, 1);
                          form.setValue("imageFiles", newFiles);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variants section */}
          <div>
            <h3 className="text-lg font-medium">Variants</h3>
            <div className="space-y-4 mt-4">
              {variants.map((variant, index) => (
                <Card key={index}>
                  <CardContent className="flex justify-between items-center p-4">
                    <div>
                      <p className="font-medium">{variant.name}</p>
                      <p className="text-sm text-gray-500">
                        Price: ${variant.price} | Quantity: {variant.quantity} |
                        SKU: {variant.sku}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          editVariant(index);
                        }}
                        aria-label={`Edit ${variant.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <span
                            className=" h-full flex items-center justify-center border py-[9px] px-2 rounded-sm shadow-sm"
                            aria-label={`Delete ${variant.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the variant.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteVariant(index)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardContent className="p-4">
                  <Form {...variantForm}>
                    <div className="space-y-4">
                      <FormField
                        control={variantForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter variant name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={variantForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter price"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={variantForm.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter quantity"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseInt(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={variantForm.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter SKU" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        onClick={variantForm.handleSubmit(onVariantSubmit)}
                      >
                        {editingVariantIndex !== null
                          ? "Update Variant"
                          : "Add Variant"}
                      </Button>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Specifications section */}
          <div>
            <h3 className="text-lg font-medium">Specifications</h3>
            <div className="space-y-4 mt-4">
              {specificationFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{index === 0 ? "Name" : ""}</FormLabel>
                        <FormControl>
                          <Input placeholder="Specification name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specifications.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{index === 0 ? "Value" : ""}</FormLabel>
                        <FormControl>
                          <Input placeholder="Specification value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSpecification({ name: "", value: "" })}
              >
                Add Specification
              </Button>
            </div>
          </div>

          {/* Status section */}
          <div>
            <h3 className="text-lg font-medium">Status</h3>
            <div className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="out_of_stock">
                          Out of Stock
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit" size={"lg"} className="col-span-2 mt-6">
          {isUpdatingProduct ? "...Updating Product" : "Update Product"}
        </Button>
      </form>
    </Form>
  );
}
