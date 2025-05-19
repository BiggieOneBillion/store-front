import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Power } from "lucide-react";

export const CategoryTable = ({
  categoryManagement,
}: {
  categoryManagement: any;
}) => {
  const {
    categories,
    isLoading,
    handleEdit,
    handleDelete,
    handleStatusToggle,
    setEditingId,
  } = categoryManagement;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : categories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No categories found
            </TableCell>
          </TableRow>
        ) : (
          categories &&
          Array.isArray(categories) &&
          categories?.map((category: any) => (
            <TableRow key={category.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.slug}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    category.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }
                >
                  {category.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {category.featured ? "Featured" : "Not Featured"}
                </Badge>
              </TableCell>
              <TableCell>{category.order || "-"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingId(category.id);
                        handleEdit(
                          {
                            name: category.name,
                            status: category.status,
                            slug: category.slug,
                            featured: category.featured,
                            order: category.order,
                            description: category.description,
                            parent: category.parent || undefined,
                            metaTitle: category.metaTitle,
                            metaDescription: category.metaDescription,
                          },
                          category.id
                        );
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusToggle(category.id, category.status)
                      }
                    >
                      <Power className="mr-2 h-4 w-4" />
                      <span>
                        {category.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
