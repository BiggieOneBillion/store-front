import {
  createProduct,
  deleteProduct,
  IProduct,
  updateProduct,
} from "@/services/api/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProduct = () => {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["storeProducts"] });
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create product");
      console.error("Create product error:", error);
    },
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
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      
      const previousProducts = queryClient.getQueryData(["products"]);
      
      // Optimistically update the product
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return old.map((product: any) =>
          product.id === params.productId
            ? { ...product, ...params.data }
            : product
        );
      });

      return { previousProducts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["storeProducts"] });
      toast.success("Product updated successfully");
    },
    onError: (error, _, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      toast.error("Failed to update product");
      console.error("Update product error:", error);
    },
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
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      
      const previousProducts = queryClient.getQueryData(["products"]);
      
      // Optimistically remove the product
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return old.filter((product: any) => product.id !== params.productId);
      });

      return { previousProducts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["storeProducts"] });
      toast.success("Product deleted successfully");
    },
    onError: (error, _, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      toast.error("Failed to delete product");
      console.error("Delete product error:", error);
    },
  });

  return {
    // create product
    createProductFn,
    isCreatingProduct,
    createProductError,
    // update product
    updateProductFn,
    isUpdatingProduct,
    updateProductError,
    // delete product
    deleteProductFn,
    isDeletingProduct,
    deleteProductError,
  };
};
