const CategoryLoader = ({ cardNumber }: { cardNumber: number }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[...Array(cardNumber)].map((_, index) => (
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
};
export default CategoryLoader;
