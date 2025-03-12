import { z } from "zod";

// Define the order schema
const orderSchema = z.object({
  id: z.string(),
  buyer: z.string().min(1, "Buyer ID is required"),
  items: z.array(
    z.object({
      product: z.string().min(1, "Product ID is required"),
      store: z.string().min(1, "Store ID is required"),
      quantity: z
        .number()
        .int()
        .positive("Quantity must be a positive integer"),
      price: z.number().positive("Price must be a positive number"),
      variant: z.object({
        name: z.string().optional(),
        option: z.string().optional(),
      }),
    })
  ),
  status: z
    .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
    .default("pending"),
  shippingAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  subtotal: z.number().positive("Subtotal must be a positive number"),
  shippingCost: z.number().positive("Shipping cost must be a positive number"),
  tax: z.number().positive("Tax must be a positive number"),
  total: z.number().positive("Total must be a positive number"),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type Order = z.infer<typeof orderSchema>;