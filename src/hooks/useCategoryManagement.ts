import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/store/user-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/services/api/categories";
import { useCategory } from "@/hooks/useCategory";
import { toast } from "sonner";
import {
  categorySchema,
  type CategoryFormValues,
  type Category,
  initialValue,
} from "@/types/category";
import { AxiosError } from "axios";

export const useCategoryManagement = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useUserStore();
  const queryClient = useQueryClient();

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

  const {
    createCategoryError,
    createCategoryFn,
    isCreatingCategory,
    updateCategoryFn,
    isUpdatingCategory,
    updateCategoryError,
    deleteCategoryFn,
    deleteCategoryError,
  } = useCategory();

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

  const handleEdit = (category: CategoryFormValues, id: string) => {
    form.reset(category);
    setIsEditing(true);
    setImagePreview(categories.find((cat) => cat.id === id)?.image || "");
    if (window.innerWidth < 768) {
      setOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategoryFn({
        token: user?.token!,
        id: id,
      });
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      if ((deleteCategoryError as AxiosError)?.status! < 500) {
        toast(
          ` ${
            (deleteCategoryError as AxiosError<{ message: string }>)?.response
              ?.data?.message
          }`
        );
        return;
      }
      console.log("DELETE ERROR", deleteCategoryError);
      toast.error("Processing Error, Please Try Again Later");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    // Add status update API call here
    console.log("Toggling status:", id, newStatus);
  };

  const onSubmit = async (values: CategoryFormValues) => {
    console.log(values);

    console.log("isEditing", isEditing);

    if (!selectedFile) {
      toast.error("Please upload a category image");
      return;
    }

    try {
      if (isEditing) {
        await updateCategoryFn({
          token: user?.token!,
          data: values,
          id: editingId,
        });
        toast.success("Category updated successfully");
        setIsEditing(false);
        setEditingId("");
        if (window.innerWidth < 768) {
          setOpen(true);
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        await createCategoryFn({
          token: user?.token!,
          data: values,
        });
        toast.success("Category created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setImagePreview(null);
      setSelectedFile(null);
      form.reset(initialValue);
    } catch (error) {
      if (
        (updateCategoryError as AxiosError)?.status === 400 ||
        (createCategoryError as AxiosError)?.status === 400
      ) {
        toast(
          ` ${
            (createCategoryError as AxiosError<{ message: string }>)?.response
              ?.data?.message ||
            (updateCategoryError as AxiosError<{ message: string }>)?.response
              ?.data?.message
          }`
        );
        return;
      }
      toast(
        `ERROR FROM CATEGORY: ${
          createCategoryError?.message || updateCategoryError?.name
        }`
      );
    }
  };

  const handleCloseEditing = () => {
    setIsEditing(false);
    setEditingId("");
    form.reset(initialValue);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(null);
    if (window.innerWidth < 768) {
      setOpen(true);
    }
  };

  return {
    imagePreview,
    setImagePreview,
    selectedFile,
    setSelectedFile,
    open,
    setOpen,
    isEditing,
    setIsEditing,
    editingId,
    setEditingId,
    form,
    categories,
    isLoading,
    isCreatingCategory,
    handleImageChange,
    handleEdit,
    handleDelete,
    handleStatusToggle,
    onSubmit,
    handleCloseEditing,
    fileInputRef,
  };
};
