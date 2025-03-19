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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getUsersOrder } from "@/services/api/order";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    paymentDate: string;
  };
  status: string;
  items: OrderItem[];
  total: number;
  id: string;
}

export default function PurchaseHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({});
  const { user } = useUserStore();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["users-order"],
    queryFn: async () =>
      await getUsersOrder({ token: user?.token!, userId: user?.id! }),
  });

  if (isLoading) {
    return <p>..Loading!</p>;
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.items.some((item) =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleIdVisibility = (orderId: string) => {
    setVisibleIds((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const formatOrderId = (id: string, isVisible: boolean) => {
    return isVisible ? id : `****${id.slice(-4)}`;
  };

  return (
    <section className="bg-white px-5 py-5 rounded-md border mt-10">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{formatOrderId(order.id, visibleIds[order.id])}</span>
                    {/* <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleIdVisibility(order.id)}
                  >
                    {visibleIds[order.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button> */}
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
                  <Badge
                    className={`${
                      order.status === "processing"
                        ? "bg-blue-500"
                        : order.status === "delivered"
                        ? "bg-green-500"
                        : order.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {order.payment.gateway}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
