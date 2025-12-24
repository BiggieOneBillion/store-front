"use client";

import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHeroSection } from "@/services/api/customization";
import { useUserStore } from "@/store/user-store";

// Zod schema for validation
const heroSectionSchema = z.object({
  heroText: z
    .string()
    .min(3, "Main text is required and must be at least 3 characters."),
  subTitle: z
    .string()
    .min(3, "Sub-title is required and must be at least 3 characters."),
  images: z
    .array(z.any())
    .length(8, "You must provide 8 images (can be empty)."),
});

type FormValues = z.infer<typeof heroSectionSchema>;

export default function HeroSectionCustomization() {
  const { register, handleSubmit, setValue, reset, formState } =
    useForm<FormValues>({
      resolver: zodResolver(heroSectionSchema),
      defaultValues: {
        heroText: "",
        subTitle: "",
        images: Array(8).fill(null),
      },
    });

  const token = useUserStore().user?.token || "";

  const [previews, setPreviews] = React.useState<(string | null)[]>(
    Array(8).fill(null)
  );
  const fileInputRefs = useRef<(HTMLInputElement | undefined)[]>([]);

  // Fetch data with react-query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["hero-section"],
    queryFn: async () => await getHeroSection(token),
  });

  // Prefill form when data is loaded
  useEffect(() => {
    if (data) {
      reset({
        heroText: data.heroText || "",
        subTitle: data.subTitle || "",
        images: Array(8).fill(null),
      });
      setPreviews((prev) => {
        const arr = Array(8).fill(null);
        if (data.images && Array.isArray(data.images)) {
          data.images.forEach((url: string, idx: number) => {
            if (url) arr[idx] = url;
          });
        }
        return arr;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, reset]);

  const onImageChange = (index: number, file: File | null) => {
    setValue(`images.${index}` as const, file, { shouldValidate: true });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => {
          const updated = [...prev];
          updated[index] = reader.result as string;
          return updated;
        });
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews((prev) => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
    }
  };

  const handleRemoveImage = (idx: number) => {
    setValue(`images.${idx}` as const, null, { shouldValidate: true });
    setPreviews((prev) => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
    if (fileInputRefs.current[idx]) {
      fileInputRefs.current[idx]!.value = "";
    }
  };

  const onSubmit = (formData: FormValues) => {
    // Handle form submission (e.g., send to API)
    // console.log(formData);
  };

  return (
    <section>
      {!data && (
        <div className="mb-4 text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-3">
          No hero section data found. Please fill out the form below.
        </div>
      )}
      <span className="text-sm text-muted-foreground mb-4">
        Note: That the herosection has default title and subtitle and images.
        The images, title and subtitles added here override the default images,
        title and subtitles{" "}
      </span>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 py-5 w-full max-w-3xl"
      >
        <div>
          <Label htmlFor="heroText" className="text-sm font-medium">
            Hero Section Main Text :
          </Label>
          <Textarea
            id="heroText"
            {...register("heroText")}
            placeholder="Enter hero section text"
            className="mt-2"
          />
          {formState.errors.heroText && (
            <span className="text-xs text-red-600">
              {formState.errors.heroText.message}
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="subTitle" className="text-sm font-medium">
            Hero Section Sub-title :
          </Label>
          <Input
            id="subTitle"
            {...register("subTitle")}
            placeholder="Enter hero section sub-title"
            className="mt-2"
          />
          {formState.errors.subTitle && (
            <span className="text-xs text-red-600">
              {formState.errors.subTitle.message}
            </span>
          )}
        </div>
        <div>
          <Label className="font-medium">Hero Section Images :</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 min-h-20 bg-white p-4 rounded border"
              >
                <input
                  id={`image-${idx}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    fileInputRefs.current[idx] = el ?? undefined;
                  }}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onImageChange(idx, file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-none shadow-none bg-zinc-50"
                  onClick={() => fileInputRefs.current[idx]?.click()}
                >
                  {previews[idx] ? "Change Image" : `Select Image ${idx + 1}`}
                </Button>
                {previews[idx] && (
                  <div className="relative mt-2">
                    <img
                      src={previews[idx]!}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-40 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 rounded-full"
                      onClick={() => handleRemoveImage(idx)}
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {formState.errors.images && (
            <span className="text-xs text-red-600">
              {formState.errors.images.message as string}
            </span>
          )}
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </section>
  );
}
