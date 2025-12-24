import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormValues } from "../types";

interface LimitsFormProps {
  form: UseFormReturn<DiscountFormValues>;
}

export function LimitsForm({ form }: LimitsFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="minimumPurchase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Purchase</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maximumDiscount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Discount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="usageLimit.perCustomer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uses Per Customer</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usageLimit.total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Usage Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}