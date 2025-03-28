import {
  addWishList,
  clearUserWishList,
  deleteUserWishListItem,
  IWishList,
} from "@/services/api/wishlist";
import { useMutation } from "@tanstack/react-query";

export const useWishList = () => {
  const {
    mutateAsync: createWishList,
    isPending: isCreatingWishList,
    error: createWishListError,
  } = useMutation({
    mutationFn: async (params: { wishList: IWishList; token: string }) =>
      addWishList(params.wishList, params.token),
  });

  const {
    mutateAsync: deleteAWishList,
    isPending: isDeletingAWishList,
    error: deleteAWishListError,
  } = useMutation({
    mutationFn: async (params: {
      productId: string;
      // storeId: string;
      token: string;
    }) => deleteUserWishListItem(params),
  });

  const {
    mutateAsync: clearWishList,
    isPending: isClearingWishList,
    error: clearWishListError,
  } = useMutation({
    mutationFn: async (token:string) => clearUserWishList(token),
  });

  return {
    // adding to wishlist
    createWishList,
    isCreatingWishList,
    createWishListError,
    // deleting from wishlist
    deleteAWishList,
    isDeletingAWishList,
    deleteAWishListError,
    // clearing wishlist
    clearWishList,
    isClearingWishList,
    clearWishListError,
  };
};
