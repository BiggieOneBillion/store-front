"use client";

import { CategoryForm } from "./components/category-form";
import { CategoriesTable } from "./components/categories-table";

export default function CategoryManagement() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryForm />
        <CategoriesTable />
      </div>
    </div>
  );
}
