"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductAlert } from "./delete-product-alert";
import { DiscountDetailsDialog } from "./discount-details-dialog";

// This type defines the shape of our data based on the provided schema.
export type Product = {
  id: string;
  name: string;
  description: string;
  store: string;
  category: { name: string; id: string };
  price: number;
  compareAtPrice?: number;
  images: string[];
  tag: "latest" | "featured" | "regular" | "sale";
  inventory: {
    quantity: number;
    sku: string;
    lowStockThreshold: number;
  };
  discount?: {
    type?: "percentage" | "fixed";
    value?: number;
    active?: boolean;
    startDate?: string;
    endDate?: string;
  };
  variants: Array<{
    _id: string;
    name: string;
    options: string[];
    price: number;
    quantity: number;
    sku: string;
    discount: {
      type: "percentage" | "fixed";
      value: number;
      active: boolean;
    };
  }>;
  specifications: Array<{
    name: string;
    value: string;
  }>;
  status: "active" | "inactive" | "out_of_stock";
  rating: number;
  totalRatings: number;
};

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  //   {
  //     accessorKey: "images",
  //     header: "Image",
  //     cell: ({ row }) => (
  //       <Image
  //         src={row.getValue("images")[0] || "/placeholder.svg"}
  //         alt={`${row.getValue("name")} image`}
  //         className="aspect-square rounded-md object-cover"
  //         width={64}
  //         height={64}
  //       />
  //     ),
  //   },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <span className="capitalize">{name}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "outline" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "inventory.quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quantity = row.original.inventory.quantity;
      return <div className="text-left pl-6">{quantity}</div>;
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  //   {
  //     accessorKey: "rating",
  //     header: ({ column }) => {
  //       return (
  //         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //           Rating
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       )
  //     },
  //     cell: ({ row }) => {
  //       return <div className="text-right">{row.getValue("rating").toFixed(1)}</div>
  //     },
  //   },
  //   {
  //     accessorKey: "createdAt",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Created At
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       return <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>;
  //     },
  //   },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => {
      const discount = row.original.discount;
      
      if (!discount?.active) {
        return <Badge variant="outline">No Discount</Badge>;
      }

      return (
        <DiscountDetailsDialog discount={discount}>
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-secondary/80"
          >
            {discount.type === 'percentage' 
              ? `${discount.value}% Off` 
              : `$${discount.value} Off`}
          </Badge>
        </DiscountDetailsDialog>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem> */}
            {/* <DropdownMenuItem> */}
            {/* Edit */}
            <EditProductDialog
              productId={product.id}
              data={{
                category: product.category.name,
                categoryId: product.category.id,
                name: product.name,
                description: product.description,
                price: product.price,
                inventory: product.inventory,
                status: product.status,
                compareAtPrice: product.compareAtPrice,
                specifications: product.specifications,
                variants: product.variants,
                tag: product.tag.toLowerCase() as
                  | "latest"
                  | "featured"
                  | "regular"
                  | "sale",
                // imageFiles: [product.images],
              }}
            />
            {/* </DropdownMenuItem> */}
            {/* <DropdownMenuItem>Delete</DropdownMenuItem> */}
            <DeleteProductAlert productId={product.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },

];
