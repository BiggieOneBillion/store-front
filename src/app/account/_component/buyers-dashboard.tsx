"use client";

import { useUserStore } from "@/store/user-store";
import Link from "next/link";
import Sidebar from "./buyers_component/sidebar";
import { useEffect, useState } from "react";
import ProfileSettings from "./buyers_component/profile-settings";
import PurchaseHistory from "./buyers_component/purchase-history";
import WishList from "./buyers_component/wish-list";
import { usePathname, useRouter } from "next/navigation";

export const hashArray = ["profile-settings", "purchase-history", "your-wishlist"];

const BuyersDashboard = () => {
  const { user } = useUserStore();
  const [index, setIndex] = useState<number>(0);
  const [hash, setHash] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Set initial hash
    setHash(window.location.hash);

    // Listen for hash changes
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (hash) {
      const newIndex = hashArray.indexOf(hash.replace("#", ""));
      if (newIndex !== -1) {
        setIndex(newIndex);
      }
    }
  }, [hash]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="flex items-start w-full h-full">
        {/* side bar */}
        <Sidebar index={index} setIndex={setIndex} />
        {/* main content */}
        <main className="py-5 px-5 flex-1">
          <header className="space-y-5 w-full">
            <div className="flex items-center justify-between text-sm">
              <h1 className="text-sm font-medium text-slate-700">Dashboard</h1>
              <h2>
                Welcome back , <span className="capitalize">{user?.name}</span>
              </h2>
            </div>
            <h2 className="text-xl font-medium">
              {index === 0 && "Profile Settings"}
              {index === 1 && "Purchase History"}
              {index === 2 && "Your Wishlist"}
            </h2>
          </header>
          <section className="w-full">
            {index === 0 && <ProfileSettings />}
            {index === 1 && <PurchaseHistory />}
            {index === 2 && <WishList />}
          </section>
        </main>
      </section>
    </main>
  );
};
export default BuyersDashboard;
