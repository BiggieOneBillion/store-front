"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns } from "./columns";
// Update this import
import { DataTable } from "./data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { File, ListFilter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";
import { getStockHistory } from "@/services/api/inventory";


const dummyStockHistory = {
  results: [
    {
      id: "1",
      product: {
        _id: "p1",
        name: "Blue T-Shirt",
        sku: "BTS-001",
      },
      type: "sale",
      quantity: -2,
      previousStock: 10,
      newStock: 8,
      reference: "ORDER-123",
      referenceType: "order",
      referenceId: "ord1",
      notes: "Stock reduction from order ORDER-123",
      performedBy: {
        _id: "u1",
        name: "John Doe",
        email: "john@example.com",
      },
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-15T10:00:00.000Z",
    },
    {
      id: "2",
      product: {
        _id: "p2",
        name: "Red Hoodie",
        sku: "RH-002",
      },
      type: "restock",
      quantity: 15,
      previousStock: 5,
      newStock: 20,
      reference: "PO-456",
      referenceType: "purchase",
      referenceId: "po1",
      notes: "Restock from supplier",
      performedBy: {
        _id: "u2",
        name: "Jane Smith",
        email: "jane@example.com",
      },
      createdAt: "2024-01-14T15:30:00.000Z",
      updatedAt: "2024-01-14T15:30:00.000Z",
    },
    {
      id: "3",
      product: {
        _id: "p3",
        name: "Black Jeans",
        sku: "BJ-003",
      },
      type: "adjustment",
      quantity: -1,
      previousStock: 12,
      newStock: 11,
      reference: "ADJ-789",
      referenceType: "adjustment",
      referenceId: "adj1",
      notes: "Inventory count adjustment",
      performedBy: {
        _id: "u1",
        name: "John Doe",
        email: "john@example.com",
      },
      createdAt: "2024-01-13T09:15:00.000Z",
      updatedAt: "2024-01-13T09:15:00.000Z",
    },
  ],
  page: 1,
  limit: 10,
  totalPages: 1,
  totalResults: 3,
};

export default function StockTableView() {
  const { user } = useUserStore();

  // Replace API call with dummy data
  const { data, isLoading } = useQuery({
    queryKey: ["stock-history"],
    queryFn: async () => await getStockHistory(user?.token!),
    initialData: [],
  });

 

  return (
    <Card>
      <CardHeader>
        <section className="flex items-center justify-between">
          <section>
            <CardTitle>Stock History</CardTitle>
            <CardDescription>Track your inventory changes</CardDescription>
          </section>
          <div className="flex items-center">
            <div className="ml-auto hidden flexy items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Sale
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Restock</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Return</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Adjustment
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
            </div>
          </div>
        </section>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm">...Loading</p>}
        {/* {isError && <p className="text-sm">Error loading data</p>} */}
        {data && data?.results! && (
          <DataTable columns={columns} data={data.results} />
        )}
      </CardContent>
    </Card>
  );
}
