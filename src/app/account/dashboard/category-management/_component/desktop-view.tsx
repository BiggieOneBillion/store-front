import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { CategoryForm } from "./category-form";
import { CategoryTable } from "./category-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

export const DesktopView = ({
  categoryManagement,
}: {
  categoryManagement: ReturnType<typeof useCategoryManagement>;
}) => {
  const { isEditing } = categoryManagement;

  return (
    <div className="hidden md:grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-5">
              {isEditing ? "Edit Category" : "Create Category"}
              {isEditing && (
                <button
                  onClick={() => categoryManagement.handleCloseEditing()}
                  className="text-xs flex items-center gap-1 font-medium bg-red-600 rounded-md text-white px-2 py-1"
                >
                  <X className="h-4 w-4"/>
                  Close editing
                </button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm categoryManagement={categoryManagement} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryTable categoryManagement={categoryManagement} />
        </CardContent>
      </Card>
    </div>
  );
};
