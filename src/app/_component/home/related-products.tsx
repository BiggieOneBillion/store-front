"use client";

import { getRelatedProduct } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import SaveToWishlist from "./save-to-wishlist";
import { Product } from "@/app/account/dashboard/product-management/_component/columns";

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
}

const RelatedProducts = ({ productId, categoryId }: RelatedProductsProps) => {
  // console.log("PRODUCTS OOO", productId, categoryId)
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const { data: relatedProducts = [], isLoading } = useQuery({
    queryKey: ["related-products", productId, categoryId],
    queryFn: async () => {
      const res = await getRelatedProduct({
        productId,
        categoryId,
        token: user?.token!,
      });
      return res;
    },
    enabled: !!productId && !!categoryId,
  });

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success("Product Added To Cart");
  };

  if (isLoading) {
    return <div>Loading related products...</div>;
  }

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-semibold mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product: Product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Link
              href={`/product/${product.category.name}-${
                product.id
              }/${product.name.replaceAll(" ", "-")}-${product.category.id}`}
            >
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link
                href={`/product/${product.category.name}-${
                  product.id
                }/${product.name.replaceAll(" ", "-")}-${product.category.id}`}
              >
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-1 text-sm text-gray-500 truncate">
                {product.category.name}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.discount?.active && (
                    <span className="text-sm text-red-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <div className="border rounded-full p-2">
                    <SaveToWishlist productId={product.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
