"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem, useCartStore } from "@/store/cart-store";

interface CartCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
}

export function CartCard({ item, onRemove }: CartCardProps) {
  // // console.log("CART ITEMS", item);
  const { updateQuantity } = useCartStore();

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center">
        <div className="relative w-24 h-24 mr-4 mb-4 sm:mb-0">
          <Image
            src={item.images[0] || "/grid-img-6.jpg"}
            alt={item.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{item.name}</h3>
          <div className="flex items-baseline gap-2 mb-2">
            {/* <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p> */}
            {item.discount && item?.discount.value! > 0 ? (
              <>
                <p className="font-semibold text-primary">
                  $
                  {item.discount.type === "percentage" &&
                    (
                      (item.price -
                        (item.price * item?.discount.value!) / 100) *
                      item.quantity
                    ).toFixed(2)}
                </p>
                <p className="line-through text-muted-foreground text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-xs text-green-600">
                  {item.discount.value}%{" "}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </>
            )}
            {/* <p className="text-xs text-muted-foreground">
              ${item.price.toFixed(2)} each
            </p> */}
          </div>
          <section className="flex items-baseline justify-between">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrease}
                disabled={item.quantity === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-2 min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <Button variant="outline" size="icon" onClick={handleIncrease}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-4 sm:mt-0 sm:ml-4"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
