"use client";
import { useEffect, useState } from "react";
import { CheckoutForm } from "./check-out-form";
import Billing from "./billing";
import { useCartStore } from "@/store/cart-store";
import { CartTable } from "./cart-details-table-view";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPayment } from "@/services/api/paystack";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { hashArray } from "@/app/account/_component/buyers-dashboard";

const CheckOutPageView = () => {
  const { cart, updateQuantity, clearCart } = useCartStore();
  const [isBilling, setIsBilling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const handleBilling = () => {
    setIsBilling(true);
  };

  const searchParams = useSearchParams();

  const router = useRouter();

  const handleVerifyPayment = async (reference: string) => {
    setIsVerifying(true);
    try {
      const res = await verifyPayment(reference);
      console.log("FROM CHECKOUT PAGE--------", res);

      if (res.status === "success") {
        toast.success("Payment verified successfully");
        clearCart();
        router.replace(`/account#${hashArray[1]}`);
      } else {
        toast.error("Payment verification failed");
      }
      setIsVerifying(false);
    } catch {
      toast.error("Payment verification failed");
      setIsVerifying(false);
    }
  };

  const handleGoBackToCheckOutForm = () => setIsBilling(false);

  useEffect(() => {
    if (searchParams.get("reference")) {
      handleVerifyPayment(searchParams.get("reference")!);
    }
  }, [searchParams]);
  return (
    <section className="grid grid-cols-2 gap-10 min-h-screen">
      {/* left section */}
      <section className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold font-sans">Your Cart</h2>
          <p className="text-gray-600 text-sm">
            Your cart items will be displayed here
          </p>
        </div>
        <CartTable items={cart} onUpdateQuantity={updateQuantity} />
      </section>
      {/* right section */}
      <section className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold font-sans">Checkout</h2>
          <p className="text-gray-600 text-sm">
            Provide billing, shipping and personal details below.
          </p>
        </div>
        {isBilling ? (
          <Billing goToCheckOut={handleGoBackToCheckOutForm} />
        ) : (
          <CheckoutForm goToBilling={handleBilling} />
        )}
      </section>
      {isVerifying && (
        <div className="fixed top-0 left-0 w-screen bg-black/20 h-screen flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 px-10 py-5 bg-white text-black">
            <Loader2 className="animate-spin" />
            <span>Verifying payment...</span>
          </div>
        </div>
      )}
    </section>
  );
};
export default CheckOutPageView;
