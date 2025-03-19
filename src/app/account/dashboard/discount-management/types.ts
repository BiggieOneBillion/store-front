import { z } from "zod";

export const discountSchema = z.object({
  code: z.string().optional(),
  type: z.enum(["percentage", "fixed"]),
  value: z
    .number()
    .min(0)
    .refine((val) => val <= 100, {
      message: "Percentage discount cannot exceed 100%",
      path: ["value"],
    }),
  startDate: z.date(),
  endDate: z.date(),
  minimumPurchase: z.number().min(0).optional(),
  maximumDiscount: z.number().min(0).optional(),
  usageLimit: z.object({
    perCustomer: z.number().int().min(1),
    total: z.number().int().min(1),
  }),
  applicableTo: z.enum(["all", "category", "product", "variant"]),
  conditions: z.object({
    categories: z.array(z.string()).optional(),
    products: z.array(z.string()).optional(),
    excludedProducts: z.array(z.string()).optional(),
  }),
  active: z.boolean().default(true),
});

export type DiscountFormValues = z.infer<typeof discountSchema>;