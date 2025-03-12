interface Variant {
  name?: string;
  option?: string;
}

interface OrderItem {
  product: string;
  store: string;
  quantity: number;
  price?: number;
  variant?: Variant;
}

interface Payment {
  reference?: string;
  status: "pending" | "success" | "failed";
  amount?: number;
  paymentDate?: Date;
  gateway: string;
  attempts: number;
  lastAttempt?: Date;
  authorization_url?: string;
  transaction_id?: string;
}

interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface Order {
  id?: string;
  buyer: string;
  items: OrderItem[];
  status?:
    | "awaiting_payment"
    | "payment_failed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  payment?: Payment;
  shippingAddress?: ShippingAddress;
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  total?: number;
}
