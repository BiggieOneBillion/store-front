import {
  addWishList,
  clearUserWishList,
  deleteUserWishListItem,
  IWishList,
} from "@/services/api/wishlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useWishList = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createWishList,
    isPending: isCreatingWishList,
    error: createWishListError,
  } = useMutation({
    mutationFn: async (params: { wishList: IWishList; token: string }) =>
      addWishList(params.wishList, params.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Added to wishlist");
    },
    onError: (error) => {
      toast.error("Failed to add to wishlist");
      console.error("Add to wishlist error:", error);
    },
  });

  const {
    mutateAsync: deleteAWishList,
    isPending: isDeletingAWishList,
    error: deleteAWishListError,
  } = useMutation({
    mutationFn: async (params: {
      productId: string;
      token: string;
    }) => deleteUserWishListItem(params),
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Snapshot previous value
      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      // Optimistically update
      queryClient.setQueryData(["wishlist"], (old: any) => {
        if (!old) return old;
        return old.filter((item: any) => item.productId !== params.productId);
      });

      return { previousWishlist };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
      toast.error("Failed to remove from wishlist");
      console.error("Remove from wishlist error:", error);
    },
  });

  const {
    mutateAsync: clearWishList,
    isPending: isClearingWishList,
    error: clearWishListError,
  } = useMutation({
    mutationFn: async (token: string) => clearUserWishList(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Wishlist cleared");
    },
    onError: (error) => {
      toast.error("Failed to clear wishlist");
      console.error("Clear wishlist error:", error);
    },
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
