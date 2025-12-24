"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getUserWishList } from "@/services/api/wishlist";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import { v4 } from "uuid";
import { DeleteWishListItemModal } from "./delete-wish-list-item-modal";
import { ClearWishListModal } from "./clear-wish-list-modal";
import { ProductCardSkeletonGrid } from "@/components/global/skeletons";
import { ErrorMessage } from "@/components/global/error-message";
import { EmptyState } from "@/components/global/empty-state";

type SimpleProduct = {
  images: string[];
  name: string;
  description: string;
  category: { name: string };
  price: number;
  id: string;
};

type SimpleCartProduct = {
  _id: string;
  product: SimpleProduct;
  store: string;
  addedAt: string;
};

type SimpleCart = {
  _id: string;
  user: string;
  products: SimpleCartProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const WishList = () => {
  const { user } = useUserStore();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  }: { 
    data: SimpleCart | undefined; 
    isLoading: boolean; 
    isError: boolean;
    error: any;
    refetch: () => void;
  } = useQuery({
    queryKey: ["user-wish-list"],
    queryFn: async () => await getUserWishList(user?.id!, user?.token!),
  });

  if (isLoading) {
    return (
      <div className="mt-2">
        <ProductCardSkeletonGrid count={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to Load Wishlist"
        message="We couldn't load your wishlist items"
        error={error}
        onRetry={refetch}
      />
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-12 w-12 text-muted-foreground" />}
        title="Your Wishlist is Empty"
        description="Save items you love to your wishlist and shop them later"
        actionLabel="Browse Products"
        actionHref="/shop"
      />
    );
  }

  return (
    <section className="mt-2">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          This is a list of your wish list and when you are ready, <br /> click
          on the (Add To Cart) button to add it to your cart.
        </p>
        {data && data.products && data.products.length > 0 && (
          <ClearWishListModal />
        )}
      </div>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data &&
          data.products &&
          data.products.length > 0 &&
          data.products.map((el) => (
            <div key={v4()}>
              <Card className="w-full max-w-sm relative shadow-none border border-transparent hover:border-gray-200 transition-colors duration-200  overflow-hidden p-2">
                {/* delete button */}
                <div className=" absolute top-3 right-2 z-40">
                  <DeleteWishListItemModal
                    productId={el.product.id}
                    storeId={el.store}
                  />
                </div>
                <div className="relative aspect-square bg-slate-50 rounded-md h-[100px] w-full">
                  <Image
                    src={el.product.images[0] || "/placeholder.svg"}
                    alt={el.product.name!}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="py-4 px-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="mb-2">
                        {el.product.category.name}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold">
                      ${el.product.price!.toFixed(2)}
                    </p>
                  </div>
                  <h3 className="font-medium mb-1 capitalize">
                    {el.product.name}
                  </h3>
                  <p className="text-xs text-gray-400 max-w-[80%]">
                    {el.product.description}
                  </p>
                  <div className="mb-4"></div>
                  <button className="flex w-full py-2 bg-slate-900 text-white border rounded-md items-center justify-center gap-1 text-sm">
                    Add To Cart
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            </div>
          ))}
      </section>
    </section>
  );
};
export default WishList;
