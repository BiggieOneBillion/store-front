"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api/categories";
import { getAllStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";
import { ProductCard } from "@/app/_component/home/product-card";
import Link from "next/link";
import { Ban } from "lucide-react";

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
  const categoryExists =
    categoriesData &&
    Array.isArray(categoriesData) &&
    categoriesData?.some(
      (cat: { name: string }) =>
        cat.name.toLowerCase() === decodeURIComponent(categories).toLowerCase()
    );

  // Only fetch products if category exists
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["all-products", categories],
    queryFn: () => getAllStoreProducts(user?.token!),
    enabled: !!categoryExists, // Only run this query if category exists
  });

  if (isCategoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-3 w-full bg-gray-200 rounded-md animate-pulse mb-1"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // console.log("Categories", categoriesData);

  if (!categoryExists) {
    return (
      <div className="container mx-auto px-4 py-2">
        <div className="bg-white rounded-lg shadow-mdy py-2 max-w-3xly mx-autoy">
          <h2 className="text-xl font-medium text-red-600 mb-1 flex items-center gap-2">
            <Ban size={16} /> Category not found
          </h2>
          <p className="text-red-700 mb-6 text-sm">
            Sorry, we couldn't find the category "
            {decodeURIComponent(categories)}". Please check out our available
            categories below :
          </p>

          <h3 className="text font-medium text-gray-700 mb-3">
            Available Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categoriesData?.map((category: any) => (
              <Link
                href={`/categories/${category.name}`}
                key={category.id}
                className="group"
              >
                <div
                  className="relative h-64 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.01] ease-in-out"
                  style={{
                    backgroundImage:
                      `url(${category.image})` ||
                      "url('/categories/default.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30" />

                  {/* Category Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 capitalize">
                          {category.name}
                        </h3>
                        <p className="text-xs md:text-sm opacity-90 line-clamp-2 capitalize">
                          {category.description}
                        </p>
                      </div>
                      {/* {category.featured && (
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )} */}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isProductsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm h-[400px]">
              {/* Image skeleton */}
              <div className="relative aspect-[4/3] bg-gray-200 animate-pulse"></div>
              
              <div className="p-4">
                {/* Category badge skeleton */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                
                {/* Product name skeleton */}
                <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                
                {/* Description skeleton */}
                <div className="h-3 w-full bg-gray-200 rounded-md animate-pulse mb-1"></div>
                <div className="h-3 w-5/6 bg-gray-200 rounded-md animate-pulse mb-3"></div>
                
                {/* Price skeleton */}
                <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // console.log("Products", productsData);

  // Filter products by category
  const filteredProducts = productsData?.filter(
    (product) =>
      product.category.name.toLowerCase() === categories.toLowerCase()
  );

  if (!filteredProducts?.length) {
    return (
      <div className="container mx-auto px-4 py-2">
        <div className="bg-white rounded-lg shadow-mdy py-2 max-w-3xly mx-autoy">
          <h2 className="text-xl font-medium text-red-600 mb-1 flex items-center gap-2">
            <Ban size={16} /> No products found
          </h2>
          <p className="text-red-700 mb-6 text-sm">
            Sorry, we couldn't find any products in the "
            {decodeURIComponent(categories)}" category. Please check out our
            other categories below:
          </p>

          <h3 className="text font-medium text-gray-700 mb-3">
            Available Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categoriesData
              ?.filter(
                (cat) =>
                  cat.name !== decodeURIComponent(categories).toLowerCase()
              )
              .map((category: any) => (
                <Link
                  href={`/categories/${category.name}`}
                  key={category.id}
                  className="group"
                >
                  <div
                    className="relative h-64 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.01] ease-in-out"
                    style={{
                      backgroundImage:
                        `url(${category.image})` ||
                        "url('/categories/default.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30" />

                    {/* Category Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-2 capitalize">
                            {category.name}
                          </h3>
                          <p className="text-xs md:text-sm opacity-90 line-clamp-2 capitalize">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
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
