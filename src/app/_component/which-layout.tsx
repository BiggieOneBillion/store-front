"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const WhichLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();

  const path = [
    "/auth",
    "/auth/register",
    "/account/dashboard",
    "/account/dashboard/store-settings",
    "/account/dashboard/product-management",
    "/account/dashboard/user-profile",
    "/account/dashboard/order-management",
  ];

  return path.includes(pathName) ? (
    <>{children}</>
  ) : (
    <main className="max-w-6xl mx-auto min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1">{children}</section>
      <Footer />
    </main>
  );
};
export default WhichLayout;
