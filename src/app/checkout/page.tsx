"use client";
import { useUserStore } from "@/store/user-store";
import CheckOutPageView from "./_component/check-out-page-view";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    redirect("/auth");
  }

  if (user.role === "seller") {
    redirect("/");
  }

  return <CheckOutPageView />;
}
