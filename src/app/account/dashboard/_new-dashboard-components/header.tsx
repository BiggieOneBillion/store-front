import Image from "next/image";
import { Search, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MobileNav />
      
      <div className="hidden md:flex flex-col gap-1 ml-5">
        <h3 className="text-black font-semibold text-xl">ADMIN PANEL</h3>
        <p className="text-gray-600 text-sm font-normal">
          From here we can manage our store, products, inventory, payments
          e.t.c
        </p>
      </div>
      
      <div className="relative ml-auto flex-1 md:grow-0 hidden">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>

      {/* mobile view */}
      <div className="flex items-center mx-autoy md:hidden">
      <Link href={"/"}>
          <h1 className="font-medium text-sm text-black/90 uppercase flex items-center gap-1">
            <Store size={16} />
            <span className="font-semibold">Multistore Store</span>
          </h1>
        </Link> 
      </div>
      
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="/placeholder-user.jpg"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </header>
  );
}