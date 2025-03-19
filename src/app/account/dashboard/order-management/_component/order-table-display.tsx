import * as React from "react";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye } from "lucide-react";
// import { Order } from "./types";

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

export function OrderTableDisplay({ orders }: { orders: Order[] }) {
  const [modalType, setModalType] = React.useState<ModalType>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const handleOpenModal = (type: ModalType, order: Order) => {
    setModalType(type);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedOrder(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>#{order._id.slice(-6)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{order.buyer.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleOpenModal("user", order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{order.items.length} items</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleOpenModal("items", order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>₦{order.total.toLocaleString()}</TableCell>
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
              <TableCell>{format(new Date(order.createdAt), "MMM dd, yyyy")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!modalType} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalType === "user" ? "Customer Details" : "Order Items"}
            </DialogTitle>
          </DialogHeader>
          {modalType === "user" && selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedOrder.buyer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder.buyer.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
                <div className="text-sm">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p>{selectedOrder.shippingAddress.country}, {selectedOrder.shippingAddress.zipCode}</p>
                </div>
              </div>
            </div>
          )}
          {modalType === "items" && selectedOrder && (
            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div key={item.product} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₦{item.price.toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between pt-4 font-medium">
                <span>Total</span>
                <span>₦{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}