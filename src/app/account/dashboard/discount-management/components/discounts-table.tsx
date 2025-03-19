"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, Power } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormValues } from "../types";
import { useUserStore } from "@/store/user-store";
import { getDiscount } from "@/services/api/discount";
import { useQuery } from "@tanstack/react-query";

interface Discount {
  usageLimit: {
    perCustomer: number;
    total: number;
  };
  conditions: {
    categories: string[];
    products: string[];
    excludedProducts: string[];
  };
  minimumPurchase: number;
  usageCount: number;
  applicableTo: "all" | "category" | "product" | "variant";
  active: boolean;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
  maximumDiscount: number;
  id: string;
}

export function DiscountsTable({ form }: DiscountsTableProps) {
  const { user } = useUserStore();
  const { data: discounts = [], isLoading } = useQuery<Discount[]>({
    queryKey: ["discount-table"],
    queryFn: async () => getDiscount({ token: user?.token! }),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleEdit = (discount: Discount) => {
    const formValues = form.getValues();
    const isFormEmpty = !formValues.code && !formValues.value;

    if (!isFormEmpty) {
      if (confirm("The create discount form has unsaved changes. Do you want to discard them?")) {
        populateForm(discount);
      }
    } else {
      populateForm(discount);
    }
  };

  const populateForm = (discount: Discount) => {
    form.reset({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      active: discount.active,
      startDate: new Date(discount.startDate),
      endDate: new Date(discount.endDate),
      minimumPurchase: discount.minimumPurchase,
      maximumDiscount: discount.maximumDiscount,
      usageLimit: discount.usageLimit,
      conditions: discount.conditions,
      applicableTo: discount.applicableTo,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {discounts.map((discount) => (
          <TableRow key={discount.id}>
            <TableCell className="font-medium">{discount.code}</TableCell>
            <TableCell className="capitalize">{discount.type}</TableCell>
            <TableCell>
              {discount.type === "percentage"
                ? `${discount.value}%`
                : `$${discount.value}`}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {new Date(discount.startDate).toLocaleDateString()} -
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(discount.endDate).toLocaleDateString()}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={discount.active ? "default" : "secondary"}
                className={discount.active ? "bg-green-500" : "bg-gray-500"}
              >
                {discount.active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>{discount.usageCount} uses</TableCell>
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
                      console.log("Toggle status", discount.id);
                    }}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    <span>{discount.active ? "Deactivate" : "Activate"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(discount)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      console.log("Delete discount", discount.id);
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface DiscountsTableProps {
  form: UseFormReturn<DiscountFormValues>;
}
