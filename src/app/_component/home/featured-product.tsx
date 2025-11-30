"use client";
import { ProductCard } from "./product-card";
import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";
import { ProductCardSkeletonGrid } from "@/components/global/skeletons";
import { ErrorMessage } from "@/components/global/error-message";
import { EmptyState } from "@/components/global/empty-state";
import { Package } from "lucide-react";

export function FeaturedProduct() {
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
        message="We couldn't load the featured products"
        error={error}
        onRetry={refetch}
      />
      
    );
  }

  // Filter products with featured tag
  const featuredProducts = data?.filter(
    (product) => product.tag === "featured"
  );

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
       <div className="space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-xl font-medium tracking-tight font-semibold text-black/80">Categories</p>
          <Package className="h-4 w-4 text-muted-foreground" />
        </div>
      <EmptyState
        icon={<Package className="h-12 w-12 text-muted-foreground" />}
        title="No Featured Products"
        description="There are no featured products available at the moment"
        secondaryActionLabel="Browse All Products"
        secondaryActionHref="/shop"
      />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4 px-4">
      <h2 className="text-xl font-medium">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 p-6y">
        {featuredProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </section>
  );
}
