"use client";
import { getCategory } from "@/services/api/categories";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Category = {
  parent: string | null;
  status: "active" | "inactive";
  featured: boolean;
  order: number;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  id: string;
  image?: string;
};

const Categories = () => {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategory(),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-3 w-full bg-gray-200 rounded-md animate-pulse mb-1"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categoriesData) return <div>No categories found.</div>;

  if (!categoriesData.results) return <div>No categories found.</div>;

  if (categoriesData.results.length === 0)
    return <div>No categories found.</div>;

  return (
    <div className="container mx-auto px-4 pb-8">
      <h1 className="text-xl text-gray-600 font-medium mb-8">
        Shop by Category
      </h1>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
            breakpoints: {
              "(min-width: 1024px)": { slidesToScroll: 3 },
              "(min-width: 768px)": { slidesToScroll: 2 },
              "(max-width: 767px)": { slidesToScroll: 1 },
            },
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categoriesData &&
              categoriesData.results.map((category: Category) => (
                <CarouselItem
                  key={category.id}
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <Link
                    href={`/categories/${category.name}`}
                    className="group block"
                  >
                    <div
                      className="relative h-64 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.01] ease-in-out"
                      style={{
                        backgroundImage:
                          `url(${category.image})` ||
                          "url('/categories/default.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-semibold mb-2 capitalize">
                              {category.name}
                            </h3>
                            <p className="text-sm opacity-90 line-clamp-2">
                              {category.description}
                            </p>
                          </div>
                          {/* {category.featured && (
                          <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )} */}
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="left-[5%] lg:left-[-50px]" />
          <CarouselNext className="right-[5%] lg:right-[-50px]" />
        </Carousel>
      </div>
    </div>
  );
};

export default Categories;
