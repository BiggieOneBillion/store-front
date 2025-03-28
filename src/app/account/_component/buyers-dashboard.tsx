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

// Add these imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Clock, Heart } from "lucide-react";

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

  const renderContent = (tabIndex: number) => (
    <>
      {tabIndex === 0 && <ProfileSettings />}
      {tabIndex === 1 && <PurchaseHistory />}
      {tabIndex === 2 && <WishList />}
    </>
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Mobile View */}
      <div className="md:hidden w-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-sm font-medium text-slate-700">Dashboard</h1>
          <h2 className="text-sm">
            Welcome back, <span className="capitalize">{user?.name}</span>
          </h2>
        </div>
        
        <Tabs defaultValue={hashArray[index]} className="w-full" onValueChange={(value) => {
          const newIndex = hashArray.indexOf(value);
          setIndex(newIndex);
          window.location.hash = value;
        }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile-settings" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="purchase-history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="your-wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile-settings">
            {renderContent(0)}
          </TabsContent>
          <TabsContent value="purchase-history">
            {renderContent(1)}
          </TabsContent>
          <TabsContent value="your-wishlist">
            {renderContent(2)}
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop View */}
      <section className="hidden md:flex items-start w-full h-full">
        <Sidebar index={index} setIndex={setIndex} />
        <main className="py-5 px-5 flex-1">
          <header className="space-y-5 w-full">
            <div className="flex items-center justify-between text-sm">
              <h1 className="text-sm font-medium text-slate-700">Dashboard</h1>
              <h2>
                Welcome back, <span className="capitalize">{user?.name}</span>
              </h2>
            </div>
            <h2 className="text-lg font-medium">
              {index === 0 && "Profile Settings"}
              {index === 1 && "Purchase History"}
              {index === 2 && "Your Wishlist"}
            </h2>
          </header>
          <section className="w-full">
            {renderContent(index)}
          </section>
        </main>
      </section>
    </main>
  );
};
export default BuyersDashboard;
