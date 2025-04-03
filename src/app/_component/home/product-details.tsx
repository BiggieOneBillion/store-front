"use client";
import { getProductDetails } from "@/services/api/product";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import SaveToWishlist from "./save-to-wishlist";
import { useParams } from "next/navigation";
// Add these imports
import { getRelatedProduct } from "@/services/api/product";
import { ProductCard } from "./product-card";
import RelatedProducts from "./related-products";

type Props = {
  id: string;
};

const ProductDetails = ({ id }: Props) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const pId = id.split("-")[1];
  const { productname } = useParams();
  const productnameArr = (productname as string)?.split("-");
  const cat = productnameArr[productnameArr.length - 1];
  const { data, isLoading } = useQuery({
    queryKey: ["product-details", id],
    queryFn: async () => await getProductDetails(pId, user?.token!),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>...Loading</p>;
  }

  const handleAddToCart = () => {
    addToCart(data);
    toast.success("Product Added To Cart");
  };

  const discountedPrice =
    data.discount?.active && data.discount?.value > 0
      ? data.discount.type === "percentage"
        ? data.price - data.price * (data.discount.value / 100)
        : data.price - data.discount.value
      : data.price;

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="containery px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-autoy flex flex-wrap">
          <img
            alt={data.name}
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={data.images[0]}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest uppercase">
              {data.category.name}
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {data.name}
            </h1>

            <p className="leading-relaxed mb-4">{data.description}</p>

            {/* Stock Status */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Stock: {data.inventory.quantity} units
                {data.inventory.quantity <=
                  data.inventory.lowStockThreshold && (
                  <span className="text-red-500 ml-2">Low Stock!</span>
                )}
              </p>
              {/* <p className="text-sm text-gray-500">SKU: {data.inventory.sku}</p> */}
            </div>

            {/* Variants section - only show if variants exist */}
            {data.variants && data.variants.length > 0 && (
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                {/* Your existing variants UI */}
              </div>
            )}

            {/* Specifications - only show if specifications exist */}
            {data.specifications && data.specifications.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Specifications:</h3>
                {data.specifications.map(
                  (spec: { name: string; value: string }, index: number) => (
                    <div key={index} className="flex text-sm">
                      <span className="font-medium">{spec.name}:</span>
                      <span className="ml-2">{spec.value}</span>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="flex items-center mt-4">
              <div className="flex flex-col">
                <span className="title-font font-medium text-2xl text-gray-900">
                  ${discountedPrice.toFixed(2)}
                </span>
                {data.discount?.active && (
                  <span className="text-sm text-red-500 line-through">
                    ${data.price.toFixed(2)}
                    {data.discount.type === "percentage" &&
                      ` (-${data.discount.value}%)`}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                // disabled={
                //   data.inventory.quantity === 0 || user?.role !== "buyer"
                // }
                className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 
                  focus:outline-none hover:bg-indigo-600 rounded disabled:bg-gray-400"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {data.inventory.quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              {/* {user && ( */}
              <div className="ml-2 border px-2 py-1 rounded">
                <SaveToWishlist productId={data.id} />
              </div>
              {/* )} */}
              {/* Wishlist button remains unchanged */}
            </div>
          </div>
        </div>
        <RelatedProducts productId={pId} categoryId={cat} />
      </div>
    </section>
  );
};
export default ProductDetails;
