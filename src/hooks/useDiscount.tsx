import {
  createDiscount,
  deactiveteDiscount,
  deleteDiscount,
  Discount,
  updateDiscount,
} from "@/services/api/discount";
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

  const {
    mutateAsync: updateDiscountFn,
    isPending: isUpdatingDiscount,
    error: updateDiscountError,
  } = useMutation({
    mutationFn: async (params: {
      token: string;
      data: Partial<Discount>;
      id: string;
    }) => updateDiscount(params),
  });

  const {
    mutateAsync: deactivateDiscountFn,
    isPending: isDeactivatingDiscount,
    error: deactivateDiscountError,
  } = useMutation({
    mutationFn: async (params: {
      token: string;
      id: string;
      status: boolean;
    }) => deactiveteDiscount(params),
  });

  const {
    mutateAsync: deleteDiscountFn,
    isPending: isDeletingDiscount,
    error: deleteDiscountError,
  } = useMutation({
    mutationFn: async (params: { token: string; id: string }) =>
      deleteDiscount(params),
  });

  return {
    // create store
    createDiscountFn,
    isCreatingDiscount,
    createDiscountError,
    updateDiscountFn,
    isUpdatingDiscount,
    updateDiscountError,
    deactivateDiscountFn,
    isDeactivatingDiscount,
    deactivateDiscountError,
    deleteDiscountFn,
    isDeletingDiscount,
    deleteDiscountError,
  };
};
