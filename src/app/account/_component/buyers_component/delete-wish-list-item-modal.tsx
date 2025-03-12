"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ToolTip } from "@/global-components/tool-tip";
import { useWishList } from "@/hooks/useWishList";
import { useUserStore } from "@/store/user-store";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  productId: string;
  storeId: string;
};

export function DeleteWishListItemModal({ productId, storeId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const { deleteAWishList, deleteAWishListError } = useWishList();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAWishList({
          productId,
          storeId,
          token: user?.token!,
        });
        toast.success("Deleted Successfully");
        queryClient.invalidateQueries({ queryKey: ["user-wish-list"] });
        setIsOpen(false);
      } catch (error) {
        toast.success(`Error Deleting: ${deleteAWishListError?.message}`);
      }
    });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <ToolTip message="Remove from wish list">
          <Trash2 className="h-4 w-4" />
        </ToolTip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
