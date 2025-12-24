import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormValues } from "../types";

interface ValidityPeriodFormProps {
  form: UseFormReturn<DiscountFormValues>;
}

export function ValidityPeriodForm({ form }: ValidityPeriodFormProps) {
  return (
    <FormField
      control={form.control}
      name="startDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Validity Period</FormLabel>
          <FormControl>
            <DatePickerWithRange
              className="w-full"
              selected={{
                from: field.value,
                to: form.getValues("endDate"),
              }}
              onSelect={(dateRange) => {
                if (dateRange?.from) {
                  form.setValue("startDate", dateRange.from);
                }
                if (dateRange?.to) {
                  form.setValue("endDate", dateRange.to);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}