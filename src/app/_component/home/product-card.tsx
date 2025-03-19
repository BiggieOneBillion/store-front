"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/services/api/product";
import { Product } from "@/app/account/dashboard/product-management/_component/columns";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import SaveToWishlist from "./save-to-wishlist";
import { useUserStore } from "@/store/user-store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Product Added To Cart", {
      position: "top-center",
    });
  };
  const { user } = useUserStore();
  return (
    <Card className="w-full max-w-sm shadow-none border-none  overflow-hidden">
      <div className="relative aspect-square bg-slate-50 rounded-md">
        <Image
          src={product.images![0] || "/placeholder.svg"}
          alt={product.name!}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="py-4 px-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            {user?.role === "buyer" && (
              <SaveToWishlist productId={product.id} />
            )}
          </div>
          <p className="text-lg font-bold">${product.price!.toFixed(2)}</p>
        </div>
        <h3 className="font-medium mb-1">{product.name}</h3>
        <div className="mb-4">
          {/* <p className="text-sm text-muted-foreground">{product.store.name}</p> */}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={user?.role !== "buyer"}
          className="flex w-full py-2 bg-slate-900 disabled:bg-slate-600 disabled:cursor-none text-white border rounded-md items-center justify-center gap-1 text-sm"
        >
          Add To Cart
          <ShoppingCart className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}
