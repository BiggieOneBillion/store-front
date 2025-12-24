import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPayment } from "@/services/api/payment";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, Clock } from "lucide-react";

type PaymentDetails = {
  authorization_url: string;
  access_code: string;
};

type Payment = {
  paymentDetails: PaymentDetails;
  currency: string;
  provider: string;
  status: string;
  order: string;
  user: string;
  amount: number;
  reference: string;
  metadata: {
    orderId: string;
    userId: string;
  };
  id: string;
};

export function RevenueCard() {
  const { user } = useUserStore();
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ["revenue-card"],
    queryFn: () => getAllPayment(user?.token!),
  });

  const totalRevenue = payments?.reduce((acc, payment) => {
    return payment.status === "success" ? acc + payment.amount : acc;
  }, 0) || 0;

  const pendingAmount = payments?.reduce((acc, payment) => {
    return payment.status === "pending" ? acc + payment.amount : acc;
  }, 0) || 0;

  const totalAmount = totalRevenue + pendingAmount;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">₦{totalAmount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">
            ₦{totalRevenue.toLocaleString()} paid
          </div>
          {pendingAmount > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-yellow-500" />
              <p className="text-xs text-yellow-500 font-medium">
                ₦{pendingAmount.toLocaleString()} pending
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
