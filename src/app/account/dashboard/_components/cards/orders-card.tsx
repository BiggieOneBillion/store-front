import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Clock, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/services/api/order";
import { useUserStore } from "@/store/user-store";

type Order = {
  status: string;
};

export function OrdersCard() {
  const { user } = useUserStore();
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["recent-orders"],
    queryFn: () => getAllOrders(user?.token!),
  });

  const processingOrders = orders?.filter(order => order.status === "processing").length || 0;
  const awaitingPaymentOrders = orders?.filter(order => order.status === "awaiting_payment").length || 0;
  const totalOrders = orders?.length || 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-8 w-24 rounded" />
          <div className="animate-pulse bg-muted h-4 w-32 rounded mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalOrders}</div>
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-3 w-3 text-amber-500" />
            <p className="text-xs text-amber-500 font-medium">
              {processingOrders} processing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-indigo-500" />
            <p className="text-xs text-indigo-500 font-medium">
              {awaitingPaymentOrders} awaiting payment
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}