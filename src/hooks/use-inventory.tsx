import { createStock, CreateStockData } from "@/services/api/inventory";
import { useMutation } from "@tanstack/react-query";

export const useInventory = () => {
  const {
    mutateAsync: createStockFn,
    isPending: isCreatingStock,
    error: createStockError,
  } = useMutation({
    mutationFn: async (params: { token: string; data: CreateStockData }) =>
      createStock(params),
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
    createStockFn,
    isCreatingStock,
    createStockError,
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
