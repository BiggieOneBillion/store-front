"use client";
import Link from "next/link";
import { Menu, Search, ShoppingBag, Store, User, X } from "lucide-react";
import { ToolTip } from "@/global-components/tool-tip";
import Logout from "./logout";
import { useCartStore } from "@/store/cart-store";
import CartSheet from "./cart/cart-sheet";
import { useUserStore } from "@/store/user-store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const { cart } = useCartStore();
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <ul className="flex md:items-center gap-4 text-sm font-medium capitalize md:flex-row flex-col">
      <Link
        href={"/"}
        className="py-1 px-2 rounded-md bg-gray-50 hover:bg-slate-100 transition-colors duration-200"
      >
        Home
      </Link>
      <Link
        href={"/categories"}
        className="py-1 px-2 rounded-md bg-gray-50 hover:bg-slate-100 transition-colors duration-200"
      >
        Categories
      </Link>
      <Link
        href={"/shop"}
        className="py-1 px-2 rounded-md bg-gray-50 hover:bg-slate-100 transition-colors duration-200"
      >
        Shop
      </Link>
    </ul>
  );

  return (
    <nav className="flex py-5 border-gray-200 items-center gap-10 justify-between px-2">
      <header>
        <Link href={"/"}>
          <h1 className="font-medium text-sm text-black/90 uppercase flex items-center gap-1">
            <Store size={16} />
            <span className="font-semibold">Multistore Store</span>
          </h1>
        </Link>
      </header>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavLinks />
      </div>

      <section className="flex items-center gap-4 ml-auto">
        {/* search */}
        <div className="hidden lg:flex items-center gap-1 w-[200px] border rounded-md px-2 py-1">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full outline-none placeholder:text-sm "
          />
          <button>
            <Search size={17} />
          </button>
        </div>
        
        <ToolTip message="cart">
          <CartSheet />
        </ToolTip>
        
        <ToolTip message="my account">
          <Link href={"/account"}>
            <User size={17} />
          </Link>
        </ToolTip>
        
        <div className="hidden md:block">
          <Logout />
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="bg-gray-100">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-8 mt-8">
              <NavLinks />
              <div className="flex items-center gap-1 border rounded-md px-2 py-1">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full outline-none placeholder:text-sm"
                />
                <button>
                  <Search size={17} />
                </button>
              </div>
              <Logout />
            </div>
          </SheetContent>
        </Sheet>
      </section>
    </nav>
  );
};

export default Navbar;
