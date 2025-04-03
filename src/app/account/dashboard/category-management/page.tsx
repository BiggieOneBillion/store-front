"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Power } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/services/api/categories";
import { useCategory } from "@/hooks/useCategory";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parent: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  order: z.number().int().optional(),
});

interface Category {
  parent: string | null;
  status: "active" | "inactive";
  featured: boolean;
  order: number;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  id: string;
}

export type CategoryFormValues = z.infer<typeof categorySchema>;

// Add imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

export default function CategoryManagement() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("imageFile", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const { user } = useUserStore();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      status: "active",
      featured: false,
    },
  });

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories({ token: user?.token! });
      return res.results;
    },
  });

  // console.log("CATEGORY DATA", categories);

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string>("");

  // Modify handleEdit function
  const handleEdit = (category: CategoryFormValues) => {
    form.reset(category);
    setIsEditing(true);
    if (window.innerWidth < 768) {
      setOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      // Add your delete API call here
      console.log("Deleting category:", id);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    // Add your status update API call here
    console.log("Toggling status:", id, newStatus);
  };

  const { createCategoryError, createCategoryFn, isCreatingCategory } =
    useCategory();

  const queryClient = useQueryClient();

  async function onSubmit(values: CategoryFormValues) {
    // console.log(values);
    if (!selectedFile) {
      toast.error("Please upload a category image");
      return;
    }

    try {
      // const formData = new FormData();
      // formData.append("name", values.name);
      // formData.append("slug", values.slug);
      // formData.append("description", values.description || "");
      // formData.append("status", values.status);
      // formData.append("featured", String(values.featured));
      // formData.append("order", String(values.order || 0));
      // formData.append("metaTitle", values.metaTitle || "");
      // formData.append("metaDescription", values.metaDescription || "");
      // formData.append("image", selectedFile!);

      await createCategoryFn({
        token: user?.token!,
        data: values,
      });

      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setImagePreview(null);
      setSelectedFile(null);
      form.reset({});
      toast.success("Category created successfully");
    } catch (error) {
      console.error(error);
      toast(` ERROR FROM CATEGORY: ${createCategoryError?.message}`);
    }
  }

  // Create CategoryForm component
  const CategoryForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageFile"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Category Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Category preview"
                        width={150}
                        height={150}
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedFile(null);
                          form.setValue("imageFile", undefined);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload an image for the category (recommended size: 800x600)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="category-slug" {...field} />
              </FormControl>
              <FormDescription>
                URL-friendly version of the category name
              </FormDescription>
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
                <Textarea placeholder="Category description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Featured Category</FormLabel>
                <FormDescription>
                  Display this category in featured sections
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Order in which category appears (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input placeholder="SEO meta title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea placeholder="SEO meta description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isCreatingCategory}>
          {isCreatingCategory
            ? "Creating..."
            : isEditing
            ? "Update Category"
            : "Create Category"}
        </Button>
      </form>
    </Form>
  );

  return (
    <div className="container mx-auto pb-10">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex flex-col items-start gap-5 md:gap-0 md:flex-row  justify-between md:items-center mb-4">
          <section>
            <h2 className="text-lg font-medium">Categories</h2>
            <p className="text-sm text-gray-500">
              Manage your product category.
            </p>
          </section>
          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) {
                setIsEditing(false);
                setEditingId("");
                form.reset({
                  status: "active",
                  featured: false,
                });
                setImagePreview(null);
                setSelectedFile(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Edit Category" : "Create Category"}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm />
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardContent>
            <Table className="text-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories &&
                  Array.isArray(categories) &&
                  categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            category.status === "active"
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }
                        >
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {category.featured ? "Featured" : "Not Featured"}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.order || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleEdit({
                                  name: category.name,
                                  status: category.status,
                                  slug: category.slug,
                                  featured: category.featured,
                                  order: category.order,
                                  description: category.description,
                                  parent: category.parent || undefined,
                                  metaTitle: category.metaTitle,
                                  metaDescription: category.metaDescription,
                                })
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusToggle(category.id, category.status)
                              }
                            >
                              <Power className="mr-2 h-4 w-4" />
                              <span>
                                {category.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Category" : "Create Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories &&
                  Array.isArray(categories) &&
                  categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            category.status === "active"
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }
                        >
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {category.featured ? "Featured" : "Not Featured"}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.order || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleEdit({
                                  name: category.name,
                                  status: category.status,
                                  slug: category.slug,
                                  featured: category.featured,
                                  order: category.order,
                                  description: category.description,
                                  parent: category.parent || undefined,
                                  metaTitle: category.metaTitle,
                                  metaDescription: category.metaDescription,
                                })
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusToggle(category.id, category.status)
                              }
                            >
                              <Power className="mr-2 h-4 w-4" />
                              <span>
                                {category.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
