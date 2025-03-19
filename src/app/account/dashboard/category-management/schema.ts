import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parent: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  order: z.number().int().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;