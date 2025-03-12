import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateProductForm } from "./create-product-form";
import { Edit, PlusCircle } from "lucide-react";
import { EditProductForm, ProductFormValues } from "./edit-product-form";

type Props = {
  data: Partial<ProductFormValues>;
  productId: string
};

export function EditProductDialog({ data, productId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="h-8 gap-1 flex items-center text-sm pl-2 w-full cursor-pointer hover:bg-zinc-100 rounded-sm">
          <Edit className="h-3.5 w-3.5 sm:hidden" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Edit Product
          </span>
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Edit the details to update the product. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditProductForm data={data} productId={productId} />
      </DialogContent>
    </Dialog>
  );
}
