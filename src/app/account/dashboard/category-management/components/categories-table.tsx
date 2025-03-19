"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api/categories";
import { CategoryTableContent } from "./category-table-content";

export function CategoriesTable() {
  const { user } = useUserStore();
  
  const { data: categories = [], isLoading } = useQuery<[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories({ token: user?.token! });
      return res;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <CategoryTableContent categories={categories} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}