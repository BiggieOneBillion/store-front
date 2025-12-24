import { CategoryForm } from "./category-form";
import { CategoryTable } from "./category-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";

export const MobileView = ({ categoryManagement }: { categoryManagement: ReturnType<typeof useCategoryManagement> }) => {
  const { open, setOpen, isEditing, setIsEditing, setEditingId, form, setImagePreview, setSelectedFile } = categoryManagement;

  return (
    <div className="md:hidden">
      <div className="flex flex-col items-start gap-5 md:gap-0 md:flex-row justify-between md:items-center mb-4">
        <section>
          <h2 className="text-lg font-medium">Categories</h2>
          <p className="text-sm text-gray-500">Manage your product category.</p>
        </section>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) {
              setIsEditing(false);
              setEditingId("");
              form.reset({
                status: "active",
                featured: false,
              });
              setImagePreview(null);
              setSelectedFile(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Category" : "Create Category"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm categoryManagement={categoryManagement} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CategoryTable categoryManagement={categoryManagement} />
      </Card>
    </div>
  );
};