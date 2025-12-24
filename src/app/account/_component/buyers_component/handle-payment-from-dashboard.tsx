import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { initiatePayment } from "@/services/api/paystack";
import { useUserStore } from "@/store/user-store";
import React, { useState } from "react";

export type Props = {
  orderId: string;
};

const HandlePaymentFromDashboard = ({ orderId }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserStore();
  const { toast } = useToast();
  const handlePayment = async (orderId: string) => {
    setIsLoading(true);
    try {
      const response = await initiatePayment(orderId, user?.token!);
      // // console.log(response);
      // Paystack returns authorization URL
      if (response.status && response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
      });
    }
    setIsLoading(false);
  };
  return (
    <>
      <Button
        onClick={() => handlePayment(orderId)}
        size="sm"
        variant="outline"
        className="ml-2"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </>
  );
};

export default HandlePaymentFromDashboard;
