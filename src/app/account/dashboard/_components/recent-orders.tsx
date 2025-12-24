import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataTagErrorSymbol, useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/services/api/order";
import { useUserStore } from "@/store/user-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useState } from "react";

type OrderItem = {
  product: string;
  productName: string;
  store: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  buyer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  status: string;
  payment: {
    status: string;
    paymentDate: string;
  };
  shippingAddress: {
    city: string;
    country: string;
    state: string;
    street: string;
    zipCode: string;
  };
  total: number;
  createdAt: string;
};

export function RecentOrders() {
  const { user } = useUserStore();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["recent-orders"],
    queryFn: () => getAllOrders(user?.token!),
  });

  const getCustomerOrders = (email: string) => {
    return orders?.filter(order => order.buyer.email === email) || [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  const getRecentOrdersByCustomer = (orders: Order[] = []) => {
    const customerOrders = orders.reduce((acc, order) => {
      const customerEmail = order.buyer.email;
      if (!acc[customerEmail] || new Date(acc[customerEmail].createdAt) < new Date(order.createdAt)) {
        acc[customerEmail] = {
          ...order,
          orderCount: acc[customerEmail] ? acc[customerEmail].orderCount + 1 : 1
        };
      } else {
        acc[customerEmail].orderCount += 1;
      }
      return acc;
    }, {} as Record<string, Order & { orderCount: number }>);

    return Object.values(customerOrders);
  };

  const recentCustomerOrders = getRecentOrdersByCustomer(orders).slice(0, 7);


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="text-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Orders Count</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCustomerOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    {order._id.slice(-6)}
                  </TableCell>
                  <TableCell>{order.buyer.name}</TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => setSelectedCustomer(order.buyer.email)}
                    >
                      {order.orderCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.status === "completed"
                          ? "bg-green-500"
                          : order.status === "processing"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Order History - {selectedCustomer && getCustomerOrders(selectedCustomer)[0]?.buyer.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="min-w-[300px]">Items</TableHead>
                    <TableHead className="w-[100px] text-right">Total</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCustomer && 
                    getCustomerOrders(selectedCustomer)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((order) => (
                        <TableRow key={order._id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            #{order._id.slice(-6)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-2">
                              {order.items.map(item => (
                                <div key={item.product} className="flex items-center justify-between py-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">{item.quantity}x</span>
                                    <span className="font-medium">{item.productName}</span>
                                  </div>
                                  <span className="text-muted-foreground">${item.price}</span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${order.total}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                order.status === "completed"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : order.status === "processing"
                                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-500 border-red-500/20"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
