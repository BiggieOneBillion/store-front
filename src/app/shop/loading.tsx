import { ProductCardSkeletonGrid } from "@/components/global/skeletons";

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded-md" />
      </div>
      
      <ProductCardSkeletonGrid count={12} />
    </div>
  );
}
