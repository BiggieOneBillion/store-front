"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api/categories";
import { getAllStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";
import { ProductCard } from "@/app/_component/home/product-card";

interface Props {
  categories: string;
}

const ShopByCategory = ({ categories }: Props) => {
  const { user } = useUserStore();

  // Fetch categories first
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories({ token: user?.token! });
      return res.results;
    },
  });

  // Check if the category exists
  const categoryExists = categoriesData && Array.isArray(categoriesData) && categoriesData?.some(
    (cat: { name: string }) =>
      cat.name.toLowerCase() === categories.toLowerCase()
  );

  // Only fetch products if category exists
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["all-products", categories],
    queryFn: () => getAllStoreProducts(user?.token!),
    enabled: !!categoryExists, // Only run this query if category exists
  });

  if (isCategoriesLoading) {
    return <div>Loading categories...</div>;
  }

  console.log("Categories", categoriesData);

  if (!categoryExists) {
    return <div>Category not found</div>;
  }

  if (isProductsLoading) {
    return <div>Loading products...</div>;
  }

  console.log("Products", productsData);

  // Filter products by category
  const filteredProducts = productsData?.filter(
    (product) =>
      product.category.name.toLowerCase() === categories.toLowerCase()
  );

  if (!filteredProducts?.length) {
    return <div>No products found in this category</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-700 capitalize">
          {categories.replace("-", " ")}
        </h1>
        <p className="text-gray-500 font-medium">Category</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;
