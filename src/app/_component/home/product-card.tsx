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
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // console.log("PRODUCTS OOO", product)
  const { addToCart } = useCartStore();
  const { user } = useUserStore();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Product Added To Cart", {
      position: "top-center",
    });
  };

  const isDiscount = product.discount?.active && product.discount?.value! > 0;
  const discountedPrice = isDiscount
    ? product.discount?.type === "percentage"
      ? product.price - product.price * (product.discount?.value! / 100)
      : product.price - product.discount?.value!
    : product.price;

  return (
    <Card className="group relative w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
      {/* Discount Badge */}
      {isDiscount && (
        <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white">
          {product.discount?.type === "percentage"
            ? `-${product.discount.value}%`
            : `-$${product.discount?.value}`}
        </Badge>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Quick Action Buttons */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={user?.role === "admin"}
            className="p-2 bg-white rounded-full hover:bg-slate-100 disabled:bg-slate-300"
            title="Add to Cart"
          >
            <ShoppingCart className="h-5 w-5 text-slate-900" />
          </button>
          {user?.role === "buyer" && (
            <div className="p-2 bg-white rounded-full hover:bg-slate-100">
              <SaveToWishlist productId={product.id} />
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <Link
          href={`/product/${product.id}/${product.name.replaceAll(" ", "-")}`}
        >
          {/* Category & Status */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category.name}
            </Badge>
            {product.inventory.quantity <=
              product.inventory.lowStockThreshold && (
              <Badge variant="destructive" className="text-xs">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-medium mb-2 line-clamp-1">{product.name}</h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-slate-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {isDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </Link>

        {/* Add to Cart Button */}
        {/* <button
          onClick={handleAddToCart}
          disabled={user?.role === "admin"}
          className="w-full py-2.5 bg-slate-900 text-white rounded-md
            hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed
            transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Add To Cart
          <ShoppingCart className="h-4 w-4" />
        </button> */}
      </CardContent>
    </Card>
  );
}
