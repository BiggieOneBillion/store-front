"use client";

import React, { Suspense, useEffect } from "react";
import CheckOutPageView from "./_component/check-out-page-view";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

const CheckOutPage = () => {
  const token = useUserStore().user?.token || "";
  const isHydrated = useUserStore().hasHydrated;
  const router = useRouter();
  const { cart } = useCartStore();

  useEffect(() => {
    if (isHydrated) {
      // Check if the user is authenticated
      if (!token) {
        // Redirect to auth page if not authenticated
        router.push("/auth");
      }

      if (cart.length === 0) {
        router.replace("/shop");
        // return null;
      }
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return <p>...Loading!!</p>;
  }

  // If authenticated, render the checkout page view

  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckOutPageView />
    </Suspense>
  );
};

export default CheckOutPage;
