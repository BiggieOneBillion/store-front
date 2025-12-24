"use client";
import { ProductCard } from "./product-card";
import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";
import { ProductCardSkeletonGrid } from "@/components/global/skeletons";
import { ErrorMessage } from "@/components/global/error-message";

export function LatestProducts() {
  const { user } = useUserStore();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => getAllStoreProducts(user?.token!),
  });

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4 px-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <ProductCardSkeletonGrid count={3} />
      </section>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to Load Products"
        message="We couldn't load the latest products"
        error={error}
        onRetry={refetch}
      />
    );
  }

  // Filter products with latest tag
  const latestProducts = data?.filter((product) => product.tag === "latest");

  if (!latestProducts || latestProducts.length === 0) return null;

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
