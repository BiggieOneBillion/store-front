import * as React from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Search,
} from "lucide-react";

type OrderItem = {
  product: string;
  productName: string;
  store: string;
  quantity: number;
  price: number;
};

type ShippingAddress = {
  city: string;
  country: string;
  state: string;
  street: string;
  zipCode: string;
};

type Payment = {
  status: string;
  paymentDate: string;
};

type Order = {
  _id: string;
  buyer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  status: string;
  payment: Payment;
  shippingAddress: ShippingAddress;
  total: number;
  createdAt: string;
};

type ModalType = "user" | "items" | null;

// Sample data for demonstration
const sampleOrders: Order[] = Array.from({ length: 25 }, (_, i) => ({
  _id: `order_${i + 1}_${Math.random().toString(36).substr(2, 9)}`,
  buyer: {
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
  },
  items: [
    {
      product: `product_${i + 1}`,
      productName: `Product ${i + 1}`,
      store: `Store ${i + 1}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: Math.floor(Math.random() * 50000) + 10000,
    },
  ],
  status: ["completed", "processing", "cancelled"][
    Math.floor(Math.random() * 3)
  ],
  payment: {
    status: "completed",
    paymentDate: new Date().toISOString(),
  },
  shippingAddress: {
    city: "Lagos",
    country: "Nigeria",
    state: "Lagos",
    street: `${i + 1} Sample Street`,
    zipCode: "100001",
  },
  total: Math.floor(Math.random() * 100000) + 20000,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500 text-white";
    case "processing":
      return "bg-yellow-500 text-white";
    default:
      return "bg-red-500 text-white";
  }
};

export default function OrderTableDisplay({
  orders = sampleOrders,
}: {
  orders?: Order[];
}) {
  const [modalType, setModalType] = React.useState<ModalType>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("");

  // Filter and search logic
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      // Search by Order ID (last 6 characters)
      const orderIdMatch = order._id.slice(-6).toLowerCase().includes(searchTerm.toLowerCase());
      
      // Search by formatted date
      const formattedDate = formatDate(order.createdAt).toLowerCase();
      const dateMatch = formattedDate.includes(searchTerm.toLowerCase());
      
      // Search by customer name
      const customerMatch = order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Combined search criteria
      const searchMatch = searchTerm === "" || orderIdMatch || dateMatch || customerMatch;
      
      // Status filter
      const statusMatch = statusFilter === "all" || order.status === statusFilter;
      
      // Date filter (if specific date is selected)
      let specificDateMatch = true;
      if (dateFilter) {
        const orderDate = new Date(order.createdAt).toDateString();
        const filterDate = new Date(dateFilter).toDateString();
        specificDateMatch = orderDate === filterDate;
      }
      
      return searchMatch && statusMatch && specificDateMatch;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Calculate pagination based on filtered orders
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, statusFilter, dateFilter]);

  const handleOpenModal = (type: ModalType, order: Order) => {
    setModalType(type);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedOrder(null);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    setCurrentPage(Math.min(totalPages, currentPage + 1));

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
  };

  return (
    <div className="w-full p-6 bg-white">
      <div className="space-y-4">
        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="px-2 py-[2px] border border-slate-300 rounded-md">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 text-sm focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Date:</span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== "all" || dateFilter) && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {(searchTerm || statusFilter !== "all" || dateFilter) && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
            {filteredOrders.length === 0 ? (
              <span className="text-red-600">No orders found matching your criteria.</span>
            ) : (
              <span>
                Found <strong>{filteredOrders.length}</strong> order{filteredOrders.length !== 1 ? 's' : ''} 
                {searchTerm && ` matching "${searchTerm}"`}
                {statusFilter !== "all" && ` with status "${statusFilter}"`}
                {dateFilter && ` from ${formatDate(dateFilter)}`}
              </span>
            )}
          </div>
        )}

        {/* Header with items per page selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Show:</span>
            <div className="px-2 py-[2px] border border-slate-300 rounded-md">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">entries</span>
          </div>
          <div className="text-sm text-gray-500">
            Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} orders
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{order.buyer.name}</span>
                        <button
                          onClick={() => handleOpenModal("user", order)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{order.items.length} items</span>
                        <button
                          onClick={() => handleOpenModal("items", order)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₦{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm || statusFilter !== "all" || dateFilter 
                      ? "No orders match your search criteria" 
                      : "No orders found"
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">
                {modalType === "user" ? "Customer Details" : "Order Items"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {modalType === "user" && selectedOrder && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedOrder.buyer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.buyer.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Shipping Address
                    </p>
                    <div className="text-sm">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state}
                      </p>
                      <p>
                        {selectedOrder.shippingAddress.country},{" "}
                        {selectedOrder.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {modalType === "items" && selectedOrder && (
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 font-medium border-t">
                    <span>Total</span>
                    <span>₦{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}