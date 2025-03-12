import {
  createProduct,
  deleteProduct,
  IProduct,
  updateProduct,
} from "@/services/api/product";
import { useMutation } from "@tanstack/react-query";

export const useProduct = () => {
  const {
    mutateAsync: createProductFn,
    isPending: isCreatingProduct,
    error: createProductError,
  } = useMutation({
    mutationFn: async (params: {
      token: string;
      data: IProduct;
      userId: string;
    }) => createProduct(params),
  });

  const {
    mutateAsync: updateProductFn,
    isPending: isUpdatingProduct,
    error: updateProductError,
  } = useMutation({
    mutationFn: async (params: {
      token: string;
      data: Partial<IProduct>;
      userId: string;
      productId: string;
    }) => updateProduct(params),
  });

  const {
    mutateAsync: deleteProductFn,
    isPending: isDeletingProduct,
    error: deleteProductError,
  } = useMutation({
    mutationFn: async (params: {
      token: string;
      userId: string;
      productId: string;
    }) => deleteProduct(params),
  });

  return {
    // create store
    createProductFn,
    isCreatingProduct,
    createProductError,
    // update store values
    updateProductFn,
    isUpdatingProduct,
    updateProductError,
    // delete product
    deleteProductFn,
    isDeletingProduct,
    deleteProductError,
  };
};
