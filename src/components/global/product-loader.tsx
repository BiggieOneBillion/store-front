const ProductLoader = ({ cardNumber }: { cardNumber: number }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(cardNumber)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-sm h-[400px]"
          >
            {/* Image skeleton */}
            <div className="relative aspect-[4/3] bg-gray-200 animate-pulse"></div>

            <div className="p-4">
              {/* Category badge skeleton */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              </div>

              {/* Product name skeleton */}
              <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2"></div>

              {/* Description skeleton */}
              <div className="h-3 w-full bg-gray-200 rounded-md animate-pulse mb-1"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded-md animate-pulse mb-3"></div>

              {/* Price skeleton */}
              <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductLoader;
