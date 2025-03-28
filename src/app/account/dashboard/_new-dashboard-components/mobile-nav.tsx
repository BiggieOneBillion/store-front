"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CirclePercent,
  CreditCard,
  Home,
  Layers,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TableOfContents,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/account/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      href: "/account/dashboard/order-management",
      icon: ShoppingCart,
      label: "Orders",
    },
    {
      href: "/account/dashboard/product-management",
      icon: Package,
      label: "Products",
    },
    {
      href: "/account/dashboard/customers-management",
      icon: Users2,
      label: "Customers",
    },
    {
      href: "/account/dashboard/payment-management",
      icon: CreditCard,
      label: "Payments",
    },
    {
      href: "/account/dashboard/discount-management",
      icon: CirclePercent,
      label: "Discount",
    },
    {
      href: "/account/dashboard/category-management",
      icon: TableOfContents,
      label: "Category",
    },
    {
      href: "/account/dashboard/stock-management",
      icon: Layers,
      label: "Stock report",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-2.5 ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}