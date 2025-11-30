import { CartCard } from "./cart-card";
import { useCartStore } from "@/store/cart-store";


export function CartItems() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } =
    useCartStore();


  return (
    <div className="max-w-2xl mx-auto p-2y">
      {/* <h2 className="text-2xl font-bold mb-4">Your Cart</h2> */}
      {cart.map((item) => (
        <CartCard
          key={item.id}
          item={item}
          onRemove={removeFromCart}
        />
      ))}
      <div className="mt-6 text-right">
        <p className="text-lg font-semibold">
          Total: ${getTotalPrice().toFixed(2)}
        </p>
      </div>
    </div>
  );
}
