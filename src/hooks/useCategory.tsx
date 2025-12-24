import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/services/api/categories";
import { CategoryFormValues } from "@/types/category";
import { useMutation } from "@tanstack/react-query";

export const useCategory = () => {
  const {
    mutateAsync: createCategoryFn,
    isPending: isCreatingCategory,
    error: createCategoryError,
  } = useMutation({
    mutationFn: async (params: { token: string; data: CategoryFormValues }) =>
      createCategory(params),
  });

  const {
    mutateAsync: updateCategoryFn,
    isPending: isUpdatingCategory,
    error: updateCategoryError,
  } = useMutation({
    mutationFn: async (params: {
      token: string;
      data: CategoryFormValues;
      id: string;
    }) => updateCategory(params),
  });

  const {
    mutateAsync: deleteCategoryFn,
    isPending: isDeletingCategory,
    error: deleteCategoryError,
  } = useMutation({
    mutationFn: async (params: { token: string; id: string }) =>
      deleteCategory(params),
  });

  return {
    // create category
    createCategoryFn,
    isCreatingCategory,
    createCategoryError,
    // update category values
    updateCategoryFn,
    isUpdatingCategory,
    updateCategoryError,
    // delete category
    deleteCategoryFn,
    isDeletingCategory,
    deleteCategoryError,
  };
};
