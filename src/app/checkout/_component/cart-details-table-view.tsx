"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash } from "lucide-react";
import { CartItem, useCartStore } from "@/store/cart-store";
import Link from "next/link";

// interface CartItem {
//   id: string
//   name: string
//   price: number
//   quantity: number
//   image: string
// }

interface CartTableProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
}

export function CartTable({ items, onUpdateQuantity }: CartTableProps) {
  const { getTotalPrice, updateQuantity, removeFromCart } = useCartStore();

  return (
    <section className="space-y-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Image
                  src={"/public/grid-img-3.jpg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.id,
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                ${item.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell>
                <Trash
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => removeFromCart(item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="w-full flex items-center gap-1 py-1 px-2 bg-slate-50 rounded-md">
        <p className="font-medium">Total Price:</p>
        <p className="text-lg font-semibold">${getTotalPrice().toFixed(2)}</p>
      </div>
      <div>
        <p className="flex items-center text-sm text-gray-500 gap-1">
          <span> Not done with shopping yet?</span>{" "}
          <Link href={"/"} className="underline">
            Go back to store
          </Link>
        </p>
      </div>
    </section>
  );
}
