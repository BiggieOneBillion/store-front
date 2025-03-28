"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

export type StockHistory = {
  id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
  };
  type: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  referenceType: string;
  referenceId: string;
  notes: string;
  performedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<StockHistory>[] = [
  {
    id: "product.name",
    accessorKey: "product.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.product.name}</span>;
    },
  },
  // {
  //   accessorKey: "product.sku",
  //   header: "SKU",
  // },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant={type === "sale" ? "destructive" : "outline"}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      return (
        <span className={quantity < 0 ? "text-red-500" : "text-green-500"}>
          {quantity > 0 ? `+${quantity}` : quantity}
        </span>
      );
    },
  },
  {
    accessorKey: "newStock",
    header: "Current Stock",
  },
   {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "performedBy.name",
    header: "Performed By",
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Date
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //      console.log(row.original.createdAt)
  //       // const date = new Date(row.getValue("createdAt")).toISOString().split("T")[0];
  //       const date = new Date(row.getValue("createdAt")).toLocaleDateString();
  //       const formatDate = format(new Date(row.getValue("createdAt")), "dd/MM/yyyy")
  //       console.log(formatDate)
  //     const day = new Date(row.getValue("createdAt")).getDate();
  //     const month = new Date(row.getValue("createdAt")).getUTCMonth() + 1;
  //     const year = new Date(row.getValue("createdAt")).getFullYear();
  //     // return `${day}/${month}/${year}`;
  //     return <span>{date}</span>;
  //   },
  // },
];
