import { useState } from "react";
import { CartCard } from "./cart-card";
import { useCartStore } from "@/store/cart-store";

interface CartItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  store: string;
}

const initialCartItems: CartItem[] = [
  {
    id: "prod_002",
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    images: ["/placeholder.svg?height=300&width=300"],
    quantity: 1,
    store: "EcoWear",
  },
  {
    id: "prod_003",
    name: "Smart Home Security Camera",
    price: 79.99,
    images: ["/placeholder.svg?height=300&width=300"],
    quantity: 1,
    store: "SafeHouse",
  },
  {
    id: "prod_001",
    name: "Wireless Bluetooth Headphones",
    price: 129.99,
    images: ["/placeholder.svg?height=300&width=300"],
    quantity: 3,
    store: "TechGadgets",
  },
];

export function CartItems() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } =
    useCartStore();


    console.log("CART", cart);


  return (
    <div className="max-w-2xl mx-auto p-2y">
      {/* <h2 className="text-2xl font-bold mb-4">Your Cart</h2> */}
      {cart.map((item) => (
        <CartCard
          key={item.id}
          item={item}
          onRemove={removeFromCart}
        />
      ))}
      <div className="mt-6 text-right">
        <p className="text-lg font-semibold">
          Total: ${getTotalPrice().toFixed(2)}
        </p>
      </div>
    </div>
  );
}
