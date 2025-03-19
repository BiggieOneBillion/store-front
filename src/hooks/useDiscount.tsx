import { createDiscount, Discount } from "@/services/api/discount";
import { useMutation } from "@tanstack/react-query";

export const useDiscount = () => {
  const {
    mutateAsync: createDiscountFn,
    isPending: isCreatingDiscount,
    error: createDiscountError,
  } = useMutation({
    mutationFn: async (params: { token: string; data: Discount }) =>
      createDiscount(params),
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
    createDiscountFn,
    isCreatingDiscount,
    createDiscountError,
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
