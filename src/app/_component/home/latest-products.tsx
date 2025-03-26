"use client";
import { ProductCard } from "./product-card";
import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";

export function LatestProducts() {
  const { user } = useUserStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => getAllStoreProducts(user?.token!),
  });

  if (isLoading) {
    return <p>...Loading</p>;
  }

  if (isError) {
    return <p>...Error</p>;
  }



  // Filter products with latest tag
  const latestProducts = data?.filter(product => product.tag === "latest");

  if(!latestProducts || latestProducts.length === 0) return null

  return (
    <section className="flex flex-col gap-4 px-4">
      <h2 className="text-xl font-medium">Latest Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6y">
        {latestProducts &&
          latestProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </section>
  );
}