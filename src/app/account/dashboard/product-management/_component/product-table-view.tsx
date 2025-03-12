"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns, type Product } from "./columns";
import { DataTable } from "./data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { File, ListFilter, PlusCircle } from "lucide-react";
import { CreateNewProductDialog } from "./create-new-product-dialog";
import { useQuery } from "@tanstack/react-query";
import { getStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";

export default function ProductsTableView() {

  const { user } = useUserStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["store-products"],
    queryFn: async () => await getStoreProducts(user?.id!, user?.token!),
  });

  return (
    <Card>
      <CardHeader>
        <section className="flex items-center justify-between">
          <section>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </section>
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
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
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <CreateNewProductDialog />
            </div>
          </div>
        </section>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm">...Loading</p>}
        {isError && <p className="text-sm">Error loading data</p>}
        {data && Array.isArray(data) && (
          <DataTable columns={columns} data={data} />
        )}
      </CardContent>
    </Card>
  );
}
