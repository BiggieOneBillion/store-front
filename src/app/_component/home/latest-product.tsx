"use client";
import { ProductCard } from "./product-card";
import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";


export function LatestProduct() {
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

  console.log("LATEST PRODUCT---", data)

  return (
    <section className="flex flex-col gap-4">
      {/* <h2 className="text-xl font-medium">Latest Product</h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6y">
        {data &&
          data.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </section>
  );
}
