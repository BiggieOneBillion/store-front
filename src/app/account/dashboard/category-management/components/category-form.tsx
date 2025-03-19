"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategory } from "@/hooks/useCategory";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";
import { CategoryFormValues, categorySchema } from "../schema";
import { CategoryFormFields } from "./category-form-fields";

export function CategoryForm() {
  const { user } = useUserStore();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      status: "active",
      featured: false,
    },
  });

  const { createCategoryError, createCategoryFn, isCreatingCategory } =
    useCategory();

  async function onSubmit(values: CategoryFormValues) {
    try {
      const res = await createCategoryFn({
        token: user?.token!,
        data: values,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
      toast(`ERROR FROM CATEGORY: ${createCategoryError?.message}`);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CategoryFormFields form={form} />
            <Button type="submit">Create Category</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}