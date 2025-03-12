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
import { useProduct } from "@/hooks/useProduct";
import { useUserStore } from "@/store/user-store";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  productId: string;
};

export function DeleteProductAlert({ productId }: Props) {
  // ! DELETE FUNCTION HERE
  const [isOpen, setIsOpen] = useState(false);
  const { deleteProductError, deleteProductFn, isDeletingProduct } =
    useProduct();
  const { user } = useUserStore();
  const handleDelete = async () => {
    try {
      await deleteProductFn({
        productId,
        userId: user?.id!,
        token: user?.token!,
      });
      toast.success("Product deleted successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error(`Unable To delete product: ${deleteProductError?.message}`);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
      <span className="h-8 gap-1 flex items-center text-sm pl-2 w-full cursor-pointer hover:bg-zinc-100 rounded-sm">
          <Trash2 className="h-3.5 w-3.5 sm:hidden" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Delete Product
          </span>
        </span>
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
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {
                isDeletingProduct ? "Deleting..." : "Delete"
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
