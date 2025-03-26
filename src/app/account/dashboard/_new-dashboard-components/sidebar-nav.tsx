"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CirclePercent,
  CreditCard,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TableOfContents,
  Users2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SidebarNav() {
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
      icon:  CirclePercent,
      label: "Discount",
    },
    {
      href: "/account/dashboard/category-management",
      icon:  TableOfContents,
      label: "Category",
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Store Front</span>
        </Link>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/account/dashboard/settings"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                pathname === "/account/dashboard/settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
