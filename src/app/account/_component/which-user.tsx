"use client";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import BuyersDashboard from "./buyers-dashboard";
import { toast } from "sonner";
import { useEffect } from "react";

const WhichUser = () => {
  const { hasHydrated, user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated) {
      if (!user || !user?.role) {
        toast.error("You have to sign in to access this page");
        router.push("/auth");
      } else if (user?.role && user?.role !== "buyer") {
        router.push("/account/dashboard");
      }
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated) {
    return <p>Loading...</p>;
  }

  if (!user || user?.role !== "buyer") {
    return <p>Redirecting...</p>;
  }

  return <BuyersDashboard />;
};

export default WhichUser;
