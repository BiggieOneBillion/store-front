"use client";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import BuyersDashboard from "./buyers-dashboard";
import { toast } from "sonner";

const WhichUser = () => {
  const { hasHydrated, user } = useUserStore();

  const router = useRouter();

  if (!hasHydrated) {
    return <p>Loading...</p>; // Show a loading state until hydration is done
  }

  if (!user || !user?.role) {
    toast.error("You have to sign in to access this page");
    router.push("/auth");
    return null;
  }

  if (user?.role && user?.role !== "buyer") {
    router.push("/account/dashboard");
    return null;
  }

  return <BuyersDashboard />;
};
export default WhichUser;
