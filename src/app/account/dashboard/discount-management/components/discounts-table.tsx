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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDiscount } from "@/hooks/useDiscount";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export function DiscountsTable({ form, setEditingId, setIsEditing }: DiscountsTableProps) {
  const { user } = useUserStore();
  const { data: discounts = [], isLoading } = useQuery<Discount[]>({
    queryKey: ["discount-table"],
    queryFn: async () => getDiscount({ token: user?.token! }),
  });

  const queryClient = useQueryClient();

  const {
    deleteDiscountFn,
    deleteDiscountError,
    isDeletingDiscount,
    deactivateDiscountFn,
    deactivateDiscountError,
  } = useDiscount();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleEdit = (discount: Discount) => {
    const formValues = form.getValues();
    const isFormEmpty = !formValues.code && !formValues.value;

    if (!isFormEmpty) {
      if (
        confirm(
          "The create discount form has unsaved changes. Do you want to discard them?"
        )
      ) {
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
    setIsEditing(true);
    setEditingId(discount.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDiscountFn({ token: user?.token!, id });
      queryClient.invalidateQueries({ queryKey: ["discount-table"] });
      toast.success("Discount deleted successfully");
    } catch (error) {
      console.error(error);
      toast(`Error in deleting discount: ${deleteDiscountError?.message}`);
    }
  };

  const handleActiveStatus = async (
    id: string,
    status: boolean
  ): Promise<void> => {
    // Handle the active status toggle logic here
    try {
      await deactivateDiscountFn({
        token: user?.token!,
        id,
        status,
      });
      queryClient.invalidateQueries({ queryKey: ["discount-table"] });
      toast.success("Discount Updated successfully");
    } catch (error) {
      console.error(error);
      toast(`Error in deleting discount: ${deactivateDiscountError?.message}`);
    }
  };

  return (
    <Table className="text-nowrap">
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
                      handleActiveStatus(discount.id, !discount.active);
                    }}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    <span>{discount.active ? "Deactivate" : "Activate"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(discount)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Discount</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the discount code "
                          {discount.code}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(discount.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isDeletingDiscount}
                        >
                          {isDeletingDiscount ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
  setIsEditing: (value: boolean) => void;
  setEditingId: (value: string) => void;
}
