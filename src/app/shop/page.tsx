"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";
import { getCategories } from "@/services/api/categories";
import { useUserStore } from "@/store/user-store";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
// import { Product } from "../account/dashboard/product-management/_component/columns";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { v4 } from "uuid";

// Add these imports at the top
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const AllProductPage = () => {
  const { user } = useUserStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 30000]);

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => getAllStoreProducts(user?.token!),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories({ token: user?.token! });
      return res.results;
    },
    initialData: [],
  });

  const filteredProducts = useMemo(
    () =>
      products?.filter((product) => {
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes("all") ||
          selectedCategories.includes(product.category.name.toLowerCase());

        const matchesTag =
          selectedTags.length === 0 ||
          selectedTags.includes("all") ||
          selectedTags.includes(product.tag.toLowerCase());

        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];

        return matchesCategory && matchesTag && matchesPrice;
      }),
    [products, selectedCategories, selectedTags, priceRange]
  );

  // Checkbox handlers
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category.toLowerCase()]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((c) => c !== category.toLowerCase())
      );
    }
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tag.toLowerCase()]);
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag.toLowerCase()));
    }
  };

  // Create a FilterContent component for reuse
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
          Categories
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectedCategories.includes("all") ? "default" : "outline"}
            size="sm"
            onClick={() =>
              handleCategoryChange("all", !selectedCategories.includes("all"))
            }
            className="h-8"
          >
            All
          </Button>
          {categories &&
            Array.isArray(categories) &&
            categories?.map((category: { name: string; id: string }) => (
              <Button
                key={category.id}
                variant={
                  selectedCategories.includes(category.name.toLowerCase())
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  handleCategoryChange(
                    category.name,
                    !selectedCategories.includes(category.name.toLowerCase())
                  )
                }
                className="h-8"
              >
                {category.name}
              </Button>
            ))}
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
          Tags
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {["all", "latest", "featured", "sale", "regular"].map((tag) => (
            <Button
              key={tag}
              variant={
                selectedTags.includes(tag.toLowerCase()) ? "default" : "outline"
              }
              size="sm"
              onClick={() =>
                handleTagChange(tag, !selectedTags.includes(tag.toLowerCase()))
              }
              className="h-8 capitalize"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
          Price Range
        </h3>
        <Slider
          defaultValue={[0, 30000]}
          max={30000}
          step={10}
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 pb-8 md:py-8">
      <div className="text-gray-600 mb-5">
        <h1 className="text-lg font-semibold">All Products</h1>
        <p className="text-sm">See and filter our list of products</p>
      </div>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Column */}
        <div className="hidden md:block min-w-[200px] w-[250px] rounded space-y-6 bg-gray-100/50 h-fit border p-4">
          <FilterContent />
        </div>

        {/* Products Grid section */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts?.length === 0 && (
              <div className="col-span-3" key={v4()}>
                <p className="text-2xl font-bold text-black/10">
                  No products found.
                </p>
              </div>
            )}
            {filteredProducts?.map((product) => {
              const discountedPrice = product.discount?.active && product.discount?.value! > 0
                ? product.discount.type === "percentage"
                  ? product.price - (product.price * (product.discount?.value! / 100))
                  : product.price - product.discount?.value!
                : product.price;

              return (
                <Link
                  href={`/product/${product.category.name}-${
                    product.id
                  }/${product.name.replaceAll(" ", "-")}-${product.category.id}`}
                  key={v4()}
                >
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative h-48 w-full">
                        <Image
                          src={product.images[0] || "/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-2 right-2">
                          {product.tag}
                        </Badge>
                        {product.discount?.active && (
                          <Badge variant="destructive" className="absolute top-2 left-2">
                            {product.discount.type === "percentage"
                              ? `-${product.discount.value}%`
                              : `-$${product.discount.value}`}
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <Badge variant="outline" className="text-gray-500">
                          {product.category.name}
                        </Badge>
                        <div className="flex flex-col">
                          <span className="font-semibold">${discountedPrice.toFixed(2)}</span>
                          {product.discount?.active && (
                            <span className="text-sm text-red-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductPage;
