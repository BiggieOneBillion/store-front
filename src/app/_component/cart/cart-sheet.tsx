"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store";
import { ShoppingBag } from "lucide-react";
import { CartItems } from "./cart-items";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CartSheet = () => {
  const { cart } = useCartStore();
  console.log("CART", cart)
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleGoToCheckOut = () => {
    router.push("/checkout");
    setIsOpen(false);
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          <ShoppingBag size={17} />
          <span
            className={`flex items-center justify-center absolute bottom-4 left-3 bg-black text-white h-5 w-5 rounded-full ${
              cart.length > 0 && "animate-pulse"
            }`}
          >
            {cart.length}
          </span>
        </div>
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader>
          <SheetTitle>Your cart items</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <section className="flex flex-col justify-betweeny h-full">
          <div className="flex-1">
            <CartItems />
          </div>
          <div className="w-full mb-5">
            <button
              onClick={handleGoToCheckOut}
              className="w-full flex justify-center font-medium py-2 rounded-md bg-slate-800 text-white"
            >
              CheckOut
            </button>
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
};
export default CartSheet;
