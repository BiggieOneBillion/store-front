import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormValues } from "../types";
import { useState } from "react";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";

interface CategorySelectorProps {
  form: UseFormReturn<DiscountFormValues>;
}

interface ProductVariant {
  discount: {
    type: string;
    value: number;
    active: boolean;
  };
  options: string[];
  _id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
}

interface Product {
  discount: {
    type: string;
    value: number;
    active: boolean;
  };
  inventory: {
    lowStockThreshold: number;
    quantity: number;
    sku: string;
  };
  tag: string;
  images: string[];
  status: string;
  rating: number;
  totalRatings: number;
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice: number;
  variants: ProductVariant[];
  store: null;
  specifications: any[];
  id: string;
}

export function CategorySelector({ form }: CategorySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user } = useUserStore();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["product-key"],
    queryFn: async () => await getAllStoreProducts(user?.token!),
  });

  if (isLoading) {
    return <p>...Loading!!</p>;
  }

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name="conditions.categories"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Categories</FormLabel>
          <Dialog>
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
                    ? `${field.value.length} categories selected`
                    : "Select categories"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </DialogTrigger>
            <DialogContent className="max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Categories</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Search categories..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => {
                        const current = field.value || [];
                        const updated = current.includes(category.name)
                          ? current.filter((c) => c !== category.name)
                          : [...current, category];
                        field.onChange(updated);
                      }}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          field.value?.includes(category.name)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}