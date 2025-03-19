import { CategoryFormValues } from "@/app/account/dashboard/category-management/page";
import { createCategory } from "@/services/api/categories";
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

  //   const {
  //     mutateAsync: updateProductFn,
  //     isPending: isUpdatingProduct,
  //     error: updateProductError,
  //   } = useMutation({
  //     mutationFn: async (params: {
  //       token: string;
  //       data: Partial<IProduct>;
  //       userId: string;
  //       productId: string;
  //     }) => updateProduct(params),
  //   });

  //   const {
  //     mutateAsync: deleteProductFn,
  //     isPending: isDeletingProduct,
  //     error: deleteProductError,
  //   } = useMutation({
  //     mutationFn: async (params: {
  //       token: string;
  //       userId: string;
  //       productId: string;
  //     }) => deleteProduct(params),
  //   });

  return {
    // create store
    createCategoryFn,
    isCreatingCategory,
    createCategoryError,
    // update store values
    // updateProductFn,
    // isUpdatingProduct,
    // updateProductError,
    // delete product
    // deleteProductFn,
    // isDeletingProduct,
    // deleteProductError,
  };
};
