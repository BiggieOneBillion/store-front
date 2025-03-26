"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllStoreProducts } from "@/services/api/product";
import { getCategories } from "@/services/api/categories";
import { useUserStore } from "@/store/user-store";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Product } from "../account/dashboard/product-management/_component/columns";

const AllProductPage = () => {
  const { user } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 30000]);
  const [filterData, setFilterData] = useState<Product[] | null>(null);

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
  });

  const filteredProducts = useMemo(
    () =>
      products?.filter((product) => {
        const matchesCategory =
          selectedCategory === "" ||
          selectedCategory === "all" ||
          product.category.name.toLowerCase() ===
            selectedCategory.toLowerCase();

        const matchesTag =
          selectedTag === "" ||
          selectedTag === "all" ||
          product.tag.toLowerCase() === selectedTag.toLowerCase();

        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];

        return matchesCategory && matchesTag && matchesPrice;
      }),
    [products, selectedCategory, selectedTag, priceRange]
  );

  // const handleSelectCategory = (value: string) => {
  //   setSelectedCategory(value);
  //   if (filterData && selectedCategory === "") {
  //     setFilterData(
  //       filterData.filter((product) => {
  //         return product.category.name.toLowerCase() === value.toLowerCase();
  //       })
  //     );
  //   } else {
  //     const result = products!?.filter((product) => {
  //       return product.category.name.toLowerCase() === value.toLowerCase();
  //     });
  //     setFilterData(result);
  //   }
  // };

  // const displayedProduct =
  //   selectedCategory === "" &&
  //   selectedTag == "" &&
  //   priceRange[0] === 0 &&
  //   priceRange[1] === 1000
  //     ? products
  //     : filteredProducts;

  if (isLoadingProducts) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Filters Column */}
        <div className="min-w-[200px] w-[250px] rounded space-y-6 bg-gray-100/50 h-fit border p-2">
         <div>
          <h3 className="text-center bg-black text-white p-1 rounded">Filters</h3>
         </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Categories</h3>
            <Select
              onValueChange={setSelectedCategory}
              value={selectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories &&
                  Array.isArray(categories) &&
                  categories?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">Tags</h3>
            <Select onValueChange={setSelectedTag} value={selectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">Price Range</h3>
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

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts?.map((product) => (
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
                  </div>
                  <div className="p-4 space-y-2">
                    <Badge variant="outline">{product.category.name}</Badge>
                    <p className="font-semibold">${product.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductPage;
