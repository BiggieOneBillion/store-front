import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormValues } from "../types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";

interface ProductSelectorProps {
  form: UseFormReturn<DiscountFormValues>;
}

export function ProductSelector({ form }: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [productsDialogOpen, setProductsDialogOpen] = useState(false);
  const [excludedDialogOpen, setExcludedDialogOpen] = useState(false);
  const { user } = useUserStore();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["product-key"],
    queryFn: async () => await getAllStoreProducts(user?.token!),
  });

  if (isLoading) {
    return <p>...Loading!!</p>;
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="conditions.products"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Products</FormLabel>
            <Dialog open={productsDialogOpen} onOpenChange={setProductsDialogOpen}>
              <DialogTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between",
                      !field.value?.length && "text-muted-foreground"
                    )}
                  >
                    {field.value?.length
                      ? `${field.value.length} products selected`
                      : "Select products"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </DialogTrigger>
              <DialogContent className="max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Select Products</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search products..."
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => {
                          const current = field.value || [];
                          const updated = current.includes(product.id)
                            ? current.filter((p) => p !== product.id)
                            : [...current, product.id];
                          field.onChange(updated);
                        }}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 ",
                            field.value?.includes(product.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />

                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ${product.price} - {product.category.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setProductsDialogOpen(false)}>Done</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="conditions.excludedProducts"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Excluded Products</FormLabel>
            <Dialog open={excludedDialogOpen} onOpenChange={setExcludedDialogOpen}>
              <DialogTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between",
                      !field.value?.length && "text-muted-foreground"
                    )}
                  >
                    {field.value?.length
                      ? `${field.value.length} products excluded`
                      : "Select products to exclude"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </DialogTrigger>
              <DialogContent className="max-w-[425px] bg-background/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle>Select Products to Exclude</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search products..."
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => {
                          const current = field.value || [];
                          const updated = current.includes(product.id)
                            ? current.filter((p) => p !== product.id)
                            : [...current, product.id];
                          field.onChange(updated);
                        }}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            field.value?.includes(product.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ${product.price} - {product.category.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setExcludedDialogOpen(false)}>Done</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
