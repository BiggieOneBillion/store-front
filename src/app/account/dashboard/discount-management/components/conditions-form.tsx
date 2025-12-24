import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormValues } from "../types";
import { ProductSelector } from "./product-selector";
import { CategorySelector } from "./category-selector";

interface ConditionsFormProps {
  form: UseFormReturn<DiscountFormValues>;
}

export function ConditionsForm({ form }: ConditionsFormProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="applicableTo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Applicable To</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select where to apply" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="category">Specific Categories</SelectItem>
                <SelectItem value="product">Specific Products</SelectItem>
                <SelectItem value="variant">Specific Variants</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("applicableTo") === "category" && (
        <CategorySelector form={form} />
      )}

      {form.watch("applicableTo") === "product" && (
        <ProductSelector form={form} />
      )}
    </>
  );
}