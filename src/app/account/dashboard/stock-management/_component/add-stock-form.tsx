"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { getStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";
import { useEffect } from "react";
import { useInventory } from "@/hooks/use-inventory";
import { toast } from "sonner";

const stockHistorySchema = z.object({
  product: z.string().min(1, "Product ID is required"),
  type: z.enum(["restock", "refund", "adjustment", "return"]),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  previousStock: z.number().int().nonnegative(),
  newStock: z.number().int().nonnegative(),
  reference: z.string().min(1, "Reference is required"),
  referenceType: z.enum(["manual", "return", "adjustment"]),
  referenceId: z.string().min(1, "Reference ID is required"),
  notes: z.string().optional(),
  performedBy: z.string().min(1, "User ID is required"),
});

type StockHistoryFormValues = z.infer<typeof stockHistorySchema>;

// Add this function at the top of the file after imports
const generateReferenceId = (type: string) => {
  const prefix = type.slice(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // generates 4-digit number
  return `${prefix}-${randomNum}`;
};

export function AddStockForm() {
  const { user } = useUserStore();

  const { data: products } = useQuery({
    queryKey: ["store-products"],
    queryFn: () => getStoreProducts(user?.id!, user?.token!),
  });

  const form = useForm<StockHistoryFormValues>({
    resolver: zodResolver(stockHistorySchema),
    defaultValues: {
      notes: "",
      performedBy: user?.id || "",
      referenceId: "",
      reference: "",
    },
  });

  console.log(form.formState.errors);

  const { createStockFn, createStockError, isCreatingStock } = useInventory();

  async function onSubmit(value: StockHistoryFormValues) {
    const input = { ...value, referenceId: null };
    try {
      const res = await createStockFn({ token: user?.token!, data: input });
      console.log(res);
      toast.success("Stock updated successfully");
      form.reset();
    } catch (error) {
    //   console.error(error);
    //   console.log("Error creating stock:", createStockError?.message);
      toast.error("Failed to update stock");
    }
  }

  // Add this effect to watch referenceType changes
  useEffect(() => {
    const referenceType = form.watch("referenceType");
    if (referenceType) {
      const generatedRef = generateReferenceId(referenceType);
      form.setValue("reference", generatedRef);
      form.setValue("referenceId", generatedRef);
    }
  }, [form.watch("referenceType")]);

  // Add this effect to calculate stock values
  useEffect(() => {
    const selectedProduct = products?.find(
      (p: { id: string }) => p.id === form.watch("product")
    );
    const quantity = form.watch("quantity") || 0;

    if (selectedProduct?.inventory?.quantity !== undefined) {
      const previousStock = selectedProduct.inventory.quantity;
      form.setValue("previousStock", previousStock);

      const type = form.watch("type");
      const newStock =
        type === "restock" || type === "return" || type === "refund"
          ? previousStock + quantity
          : previousStock - quantity;

      form.setValue("newStock", newStock >= 0 ? newStock : previousStock);
      //   form.setValue("newStock", previousStock + quantity);
    }
  }, [
    form.watch("product"),
    form.watch("quantity"),
    form.watch("type"),
    products,
  ]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products?.map((product: { id: string; name: string }) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="restock">Restock</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referenceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reference type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referenceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference ID</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="previousStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Stock</FormLabel>
                <FormControl>
                  <Input {...field} disabled type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Stock</FormLabel>
                <FormControl>
                  <Input {...field} disabled type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isCreatingStock}>
          {isCreatingStock ? "Updating..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
