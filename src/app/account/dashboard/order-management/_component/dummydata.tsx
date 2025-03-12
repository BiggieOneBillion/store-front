import { Order } from "./order-details-modal";

// Generate dummy data
export const dummyData: Order[] = Array.from({ length: 10 }, (_, i) => ({
  id: `ORD-${i + 1}`,
  buyer: `BUYER-${i + 1}`,
  items: [
    {
      product: `PROD-${i + 1}`,
      store: `STORE-${i + 1}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: Number.parseFloat((Math.random() * 100).toFixed(2)),
      variant: {
        name: `Variant ${i + 1}`,
        option: `Option ${i + 1}`,
      },
    },
  ],
  status: ["pending", "processing", "shipped", "delivered", "cancelled"][
    Math.floor(Math.random() * 5)
  ] as Order["status"],
  shippingAddress: {
    street: `${i + 1} Main St`,
    city: `City ${i + 1}`,
    state: `State ${i + 1}`,
    country: `Country ${i + 1}`,
    zipCode: `${10000 + i}`,
  },
  subtotal: Number.parseFloat((Math.random() * 500).toFixed(2)),
  shippingCost: Number.parseFloat((Math.random() * 50).toFixed(2)),
  tax: Number.parseFloat((Math.random() * 30).toFixed(2)),
  total: Number.parseFloat((Math.random() * 600).toFixed(2)),
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  ),
  updatedAt: new Date(),
}));