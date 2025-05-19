const LoadingCard = () => {
  return (
    <div className="overflow-hidden bg-white rounded-md shadow-sm">
      <div className="p-0">
        {/* Image skeleton */}
        <div className="relative h-48 w-full bg-gray-200 animate-pulse">
          {/* Badge skeletons */}
          <div className="absolute top-2 right-2 w-16 h-5 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="absolute top-2 left-2 w-14 h-5 bg-gray-300 rounded-full animate-pulse"></div>
        </div>

        <div className="p-4 space-y-2">
          {/* Category badge skeleton */}
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>

          {/* Price skeleton */}
          <div className="flex flex-col gap-1">
            <div className="w-20 h-5 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;
