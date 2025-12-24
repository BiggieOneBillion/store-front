import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parent: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  order: z.number().int().optional(),
});

export const initialValue = {
  name: "",
  slug: "",
  description: "",
  // parent: undefined,
  imageFile: undefined,
  status: "active" as "active" | "inactive",
  featured: false,
  // metaTitle: "",
  // metaDescription: "",
  order: 0,
};

export type CategoryFormValues = z.infer<typeof categorySchema>;

export interface Category {
  parent: string | null;
  status: "active" | "inactive";
  featured: boolean;
  order: number;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  id: string;
  image?: string;
}
