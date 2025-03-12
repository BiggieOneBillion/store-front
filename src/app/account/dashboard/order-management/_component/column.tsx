import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dispatch, SetStateAction } from "react";

// Update Order interface to match the data structure
interface Order {
  _id: string;
  buyer: {
    name: string;
    email: string;
  };
  items: Array<{
    _id: string;
    product: string;
    productName: string;
    store: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  payment: {
    status: string;
    paymentDate: string;
  };
  total: number;
  createdAt: string;
}

export function getColumns(
  setSelectedOrder: Dispatch<SetStateAction<Order | null>>
) {
  const columns: ColumnDef<Order>[] = [
    // {
    //   accessorKey: "_id",
    //   header: "Order ID",
    //   cell: ({ row }) => (
    //     <Button variant="link" onClick={() => setSelectedOrder(row.original)}>
    //       {row.getValue("_id")}
    //     </Button>
    //   ),
    // },
    {
      accessorKey: "buyer",
      header: "Buyer",
      cell: ({ row }) => {
        const buyer = row.getValue("buyer") as Order["buyer"];
        return (
          <div className="flex flex-col">
            <span className="font-medium">{buyer.name}</span>
            <span className="text-sm text-muted-foreground">{buyer.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "default" | "destructive" | "outline" | "secondary" =
          status === "processing"
            ? "default"
            : status === "shipped"
            ? "secondary"
            : status === "delivered"
            ? "outline"
            : "destructive";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => {
        const payment = row.getValue("payment") as Order["payment"];
        let variant: "outline" | "destructive" =
          payment.status === "success" ? "outline" : "destructive";
        return <Badge variant={variant}>{payment.status}</Badge>;
      },
    },
    {
      accessorKey: "items",
      header: "Product Name",
      cell: ({ row }) => {
        const items = row.getValue("items") as Order["items"];
        return <span>{items[0].productName}</span>;
      },
    },
    {
      id: "itemCount",
      accessorKey: "items",
      header: "Product Type",
      cell: ({ row }) => {
        const items = row.getValue("items") as Order["items"];
        return items.length;
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        const amount = row.getValue("total") as number;
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order._id)}
              >
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
}
