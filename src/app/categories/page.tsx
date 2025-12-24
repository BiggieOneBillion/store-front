"use client";
import { getCategory } from "@/services/api/categories";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

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

const CategoriesPage = () => {
  const { data: categoriesData, isLoading } = useQuery<
    { results: Category[] },
    Error
  >({
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

  // // console.log(categoriesData);

  return (
    <div className="container mx-auto px-4 pb-8 md:py-8">
      <h1 className="md:text-xl text-gray-600 font-medium mb-8">
        Shop By Category
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesData &&
          Array.isArray(categoriesData.results) &&
          categoriesData?.results.map((category: Category) => (
            <Link
              href={`/categories/${category.name}`}
              key={category.id}
              className="group"
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
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30" />

                {/* Category Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 capitalize">
                        {category.name}
                      </h3>
                      <p className="text-xs md:text-sm opacity-90 line-clamp-2 capitalize">
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
          ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
