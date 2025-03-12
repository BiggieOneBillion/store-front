import { useEffect, useState } from "react";

import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const PaymentVerificationView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get("reference");
        if (!reference) {
          setStatus("Invalid payment reference");
          return;
        }

        // !Verify payment with backend---not correct implementation
        const response = await axios.get(
          `/api/v1/paystack/verify?reference=${reference}`
        );

        if (response.data.status === "success") {
          setStatus("Payment successful! Redirecting to order details...");
          const orderId = localStorage.getItem("pendingOrderId");
          localStorage.removeItem("pendingOrderId"); // Clean up

          // Redirect to order details page
          setTimeout(() => {
            router.push(`/accounts`);
          }, 2000);
        } else {
          setStatus("Payment failed. Please try again.");
          setTimeout(() => {
            router.push("/checkout");
          }, 2000);
        }
      } catch (error) {
        setStatus("Error verifying payment. Please contact support.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="payment-verification">
      <h2>Payment Verification</h2>
      <div className="status-message">{status}</div>
      {verifying && <div className="loading-spinner" />}
    </div>
  );
};

export default PaymentVerificationView;
