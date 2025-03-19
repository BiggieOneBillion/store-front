"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentHistory from "./_component/payment-history";
import PaymentSettings from "./_component/payment-settings";

export default function PaymentPage() {
  return (
    <div className=" py-6">
      <Tabs
        defaultValue="payment-history"
        className="w-full"
        orientation="horizontal"
      >
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          <TabsTrigger value="payment-settings">Payment Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="payment-history">
          <PaymentHistory />
        </TabsContent>
        <TabsContent value="payment-settings">
          <PaymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
