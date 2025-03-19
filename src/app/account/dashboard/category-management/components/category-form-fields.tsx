"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { CategoryFormValues } from "../schema";

interface CategoryFormFieldsProps {
  form: UseFormReturn<CategoryFormValues>;
}

export function CategoryFormFields({ form }: CategoryFormFieldsProps) {
  return (
    <>
      {/* All your existing form fields */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Category name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* ... Copy all other form fields here ... */}
    </>
  );
}