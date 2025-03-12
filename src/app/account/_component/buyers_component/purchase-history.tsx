"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";
import { getUsersOrder } from "@/services/api/order";
import Image from "next/image";
import { initiatePayment } from "@/services/api/paystack";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface ProductType {
  images: string[];
  name: string;
  description: string;
  price: number;
  id: string;
}

interface StoreType {
  name: string;
  description: string;
  logo: string;
  id: string;
}

interface OrderItemType {
  _id: string;
  product: ProductType;
  store: StoreType;
  quantity: number;
  price: number;
}

interface PaymentType {
  status: "success" | "pending" | "failed";
  gateway: string;
  amount: number;
  paymentDate: string;
}

interface OrderType {
  payment: PaymentType;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItemType[];
  total: number;
  id: string;
}

const PurchaseHistory = () => {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { user } = useUserStore();

  const { data, isLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => await getUsersOrder({ token: user?.token! }),
  });

  const handleViewProducts = (order: OrderType) => {
    setSelectedOrder(order);
    setIsProductModalOpen(true);
  };

  const handleViewPayment = (order: OrderType) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  const { mutate: retryPayment, isPending } = useMutation({
    mutationFn: (id: string) => initiatePayment(id!, user?.token!),
    onSuccess: (data) => {
      // Redirect to Paystack payment page
      window.location.href = data.data.authorization_url;
    },
    onError: (error) => {
      // Handle error (you might want to add a toast notification here)
      console.error("Payment initiation failed:", error);
    },
  });

  if (isLoading) {
    return <p className="text-black">...Loading!!!</p>;
  }

  console.log(data);

  return (
    <section className="pb-5">
      <div className="container mx-auto">
        <h2 className="text-sm font-medium text-gray-600 mb-4">
          Click on the products or payment column to see more details
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Order Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((order: OrderType, index: number) => (
              <TableRow key={order.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {(order.payment?.paymentDate &&
                    formatDate(order.payment.paymentDate)) ||
                    "Awaiting Payment"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    onClick={() => handleViewProducts(order)}
                  >
                    {order.items.length} items
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    onClick={() => handleViewPayment(order)}
                  >
                    ${order.payment?.amount}
                  </Button>
                </TableCell>
                <TableCell>
                  <span
                    className={`capitalize ${
                      order.payment.status === "success"
                        ? "text-green-600"
                        : order.payment.status === "failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.payment.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="capitalize">
                      {order.status.replaceAll("_", " ")}
                    </span>
                    {(order.payment.status === "pending" ||
                      order.payment.status === "failed") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryPayment(order.id)}
                        disabled={isPending}
                      >
                        {isPending ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          "Retry Payment"
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Products Modal */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Products</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder?.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="flex items-center gap-2">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        <span>{item.product.name}</span>
                      </TableCell>
                      <TableCell>{item.store.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>
                        ${(item.quantity * item.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Modal */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {selectedOrder?.payment?.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gateway</p>
                  <p className="font-medium">
                    {selectedOrder?.payment?.gateway}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">
                    ${selectedOrder?.payment?.amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Date</p>
                  <p className="font-medium">
                    {selectedOrder?.payment?.paymentDate &&
                      formatDate(selectedOrder.payment.paymentDate)}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PurchaseHistory;
