"use client";
import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { ToolTip } from "@/global-components/tool-tip";
import Logout from "./logout";
import { useCartStore } from "@/store/cart-store";
import CartSheet from "./cart/cart-sheet";
import { useUserStore } from "@/store/user-store";

const Navbar = () => {
  const { cart } = useCartStore();
  const { user } = useUserStore();
  return (
    <nav className="flex py-5 border-gray-200 items-center justify-between">
      <header>
        <h1 className="font-medium text-sm text-black/90 uppercase">
          Multistore Store
        </h1>
      </header>
      <ul className="flex items-center gap-4 text-sm font-medium capitalize">
        <Link
          href={"/"}
          className="py-1 px-2 rounded-md bg-gray-50 hover:bg-slate-100 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          href={"/"}
          className="py-1 px-2 rounded-md bg-gray-50 hover:bg-slate-100 transition-colors duration-200"
        >
          Categories
        </Link>
        <Link
          href={"/"}
          className="py-1 px-2 rounded-md bg-gray-50 hover:bg-slate-100 transition-colors duration-200"
        >
          Shops
        </Link>
        <Link
          href={"/"}
          className="py-1 px-2 rounded-md bg-gray-50 hover:bg-slate-100 transition-colors duration-200"
        >
          About Us
        </Link>
      </ul>

      <section className="flex items-center gap-4">
        {/* search */}
        <div className="flex items-center gap-1 w-[200px] border rounded-md px-2 py-1">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full outline-none placeholder:text-sm"
          />
          <button>
            <Search size={17} />
          </button>
        </div>
        {user?.role === "buyer" && (
          <ToolTip message="cart">
            <CartSheet />
          </ToolTip>
        )}
        <ToolTip message="my account">
          <Link href={"/account"}>
            <User size={17} />
          </Link>
        </ToolTip>
        {/* <ToolTip message="log out"> */}
        {/* <span> */}
        <Logout />
        {/* </span> */}
        {/* </ToolTip> */}
      </section>
    </nav>
  );
};
export default Navbar;
