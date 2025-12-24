"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

// Add this type and helper function at the top of the file
export type GroupedStockHistory = {
  productId: string;
  productName: string;
  currentStock: number;
  history: StockHistory[];
};

export const columns: ColumnDef<GroupedStockHistory>[] = [
  {
    id: "productName",
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
    cell: ({ row }) => <span>{row.original.productName}</span>,
  },
  {
    accessorKey: "currentStock",
    header: "Current Stock",
  },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => {
      const { history, productName } = row.original;

      if (history.length === 0) {
        return <span>No history available.</span>;
      }

      // function recordNote(record: string): string {
      //   let note = record.split(" ");
      //   //  if(note[note.length -1] === ){
      //   //      return note.join(" ");
      //   //  }
      //   note.pop();
      //   return note.join(" ");
      // }

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4 mr-2" />
              View History
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Stock History - {productName}</DialogTitle>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity Change</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {format(new Date(record.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.type === "sale" ? "destructive" : "outline"
                        }
                      >
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          record.quantity < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {record.quantity > 0
                          ? `+${record.quantity}`
                          : record.quantity}
                      </span>
                    </TableCell>
                    <TableCell>{record.performedBy.name}</TableCell>
                    <TableCell>{record.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
