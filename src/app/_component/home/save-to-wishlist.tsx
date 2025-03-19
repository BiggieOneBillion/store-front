"use client";

import { useWishList } from "@/hooks/useWishList";
import { useUserStore } from "@/store/user-store";
import { Bookmark, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  productId: string;
};

const SaveToWishlist = ({ productId}: Props) => {
  const [isPending, startTransition] = useTransition();

  const { user } = useUserStore();

  const { createWishList, createWishListError } = useWishList();

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error("You have to be logged in to add to wishlist", {
        position: "top-center",
      });
      return;
    }
    startTransition(async () => {
      try {
        await createWishList({
          token: user?.token!,
          wishList: {
            productId,
          },
        });
        toast.success("Added to wishlist");
      } catch (error) {
        console.log(createWishListError)
        toast.success(
          `Operation Unsuccessful: ${createWishListError?.message}`
        );
      }
    });
  };
  return (
    <button className="mb-2" onClick={handleAddToWishlist}>
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </button>
  );
};
export default SaveToWishlist;
