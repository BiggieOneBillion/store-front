import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getUsersOrder, cancelOrder } from "@/services/api/order";
import { useUserStore } from "@/store/user-store";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // <-- add useQueryClient
import { CheckCircle2, XCircle, Clock, MoreHorizontal } from "lucide-react"; // <-- icon
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // <-- popover
import HandlePaymentFromDashboard from "./handle-payment-from-dashboard";

interface OrderItem {
  _id: string;
  product: {
    images: string[];
    name: string;
    description: string;
    price: number;
    id: string;
  };
  store: null;
  quantity: number;
  price: number;
}
interface Order {
  payment: {
    status: string;
    gateway: string;
    amount: number;
    paymentDate: string; // ISO string
  };
  status: string;
  items: OrderItem[];
  total: number;
  id: string;
}

const toLocalISODate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
};

export default function PurchaseHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({});
  const { user } = useUserStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // date filters
  const [singleDate, setSingleDate] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data: orders = [], isLoading: isloadingOrders } = useQuery<Order[]>({
    queryKey: ["users-order"],
    queryFn: async () =>
      await getUsersOrder({ token: user?.token!, userId: user?.id! }),
  });

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, singleDate, fromDate, toDate]);

  if (isloadingOrders) return <p>..Loading!</p>;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.items.some((item) =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const orderDateStr = toLocalISODate(new Date(order.payment.paymentDate));
    let matchesDate = true;
    if (singleDate) {
      matchesDate = orderDateStr === singleDate;
    } else {
      if (fromDate && orderDateStr < fromDate) matchesDate = false;
      if (toDate && orderDateStr > toDate) matchesDate = false;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pagedOrders = filteredOrders.slice(startIndex, endIndex);

  const toggleIdVisibility = (orderId: string) =>
    setVisibleIds((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

  const formatOrderId = (id: string, isVisible: boolean) =>
    isVisible ? id : `****${id.slice(-4)}`;

  const clearDates = () => {
    setSingleDate("");
    setFromDate("");
    setToDate("");
  };

  // --- CANCEL ORDER ---
  const canCancel = (status: string) =>
    ["pending", "processing", "awaiting_payment"].includes(status);

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder({ orderId, token: user?.token! }); // <-- adjust to your API
      toast({
        title: "Order cancelled",
        description: `Order ${orderId} was cancelled.`,
      });
      // refresh list
      queryClient.invalidateQueries({ queryKey: ["users-order"] });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Cancellation failed",
        description: e?.message || "Please try again.",
      });
    }
  };

  const handleStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      case "awaiting_payment":
        return "Awaiting Payment";
      default:
        return status;
    }
  };
  return (
    <section className="bg-white px-5 py-5 rounded-md border mt-10">
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            {/* Date */}
            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground mb-1">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    className="max-w-[180px]"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-0.5"
                    onClick={clearDates}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Search (optional if you want back) */}
            {/* <Input
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            /> */}
          </div>

          {/* Page size */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-[60px] text-right"></TableHead>{" "}
              {/* NEW COLUMN */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              pagedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>
                        {formatOrderId(order.id, visibleIds[order.id])}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {new Date(order.payment.paymentDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="text-sm">
                          {order.items.length} items
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh]">
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-start gap-4 p-4 border rounded-lg"
                              >
                                {item.product.images[0] && (
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded-md"
                                  />
                                )}
                                <div className="flex-1 space-y-2">
                                  <h3 className="font-medium">
                                    {item.product.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.product.description}
                                  </p>
                                  <div className="flex justify-between text-sm">
                                    <span>Quantity: {item.quantity}</span>
                                    <span>Price: ${item.price}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  <TableCell>${order.total.toFixed(2)}</TableCell>

                  <TableCell>
                    <section>
                      <Badge
                        className={`${
                          order.status === "processing"
                            ? "bg-blue-500"
                            : order.status === "delivered"
                            ? "bg-green-500"
                            : order.status === "cancelled"
                            ? "bg-red-500"
                            : order.status === "awaiting_payment"
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {handleStatusText(order.status)}
                      </Badge>
                      <section className="hidden mt-2 md:block">
                        {order.status === "awaiting_payment" && (
                          <HandlePaymentFromDashboard orderId={order.id} />
                        )}
                      </section>
                    </section>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`capitalize flex items-center gap-1.5 ${
                          order.payment.status === "success"
                            ? "text-green-500 border-green-500"
                            : order.payment.status === "failed"
                            ? "text-red-500 border-red-500"
                            : "text-orange-500 border-orange-500"
                        }`}
                      >
                        {order.payment.status === "success" && (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        {order.payment.status === "failed" && (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {order.payment.status === "pending" && (
                          <Clock className="h-3.5 w-3.5" />
                        )}
                        {order.payment.status}
                      </span>
                      {order.status === "awaiting_payment" && (
                        <HandlePaymentFromDashboard orderId={order.id} />
                      )}
                    </div>
                  </TableCell>

                  {/* NEW: More / Actions */}
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open actions</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-44">
                        <div className="space-y-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => handleCancel(order.id)}
                            disabled={!canCancel(order.status)}
                          >
                            Cancel order
                          </Button>
                          {!canCancel(order.status) && (
                            <p className="text-xs text-muted-foreground text-center">
                              Only pending/processing orders can be cancelled.
                            </p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination footer */}
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">
              {totalItems === 0 ? 0 : startIndex + 1}–{endIndex}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-xs md:text-sm">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
