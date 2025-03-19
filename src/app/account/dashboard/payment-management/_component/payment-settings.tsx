"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const bankAccountSchema = z.object({
  accountName: z.string().min(2, { message: "Account name is required" }),
  accountNumber: z
    .string()
    .min(8, { message: "Valid account number required" }),
  bankName: z.string().min(2, { message: "Bank name is required" }),
  routingNumber: z
    .string()
    .min(9, { message: "Valid routing number required" }),
  accountType: z.string().min(1, { message: "Account type is required" }),
});

const paypalSchema = z.object({
  paypalEmail: z.string().email({ message: "Valid email required" }),
});

export default function PaymentSettings() {
  const [activePaymentMethod, setActivePaymentMethod] = useState("bank");
  const [autoPayouts, setAutoPayouts] = useState(true);
  const [minimumPayout, setMinimumPayout] = useState("50");

  const bankForm = useForm<z.infer<typeof bankAccountSchema>>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: "",
    },
  });

  const paypalForm = useForm<z.infer<typeof paypalSchema>>({
    resolver: zodResolver(paypalSchema),
    defaultValues: {
      paypalEmail: "",
    },
  });

  function onBankSubmit(values: z.infer<typeof bankAccountSchema>) {
    console.log(values);
    toast.success("Bank account details saved successfully");
  }

  function onPaypalSubmit(values: z.infer<typeof paypalSchema>) {
    console.log(values);
    toast.success("PayPal details saved successfully");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>
            Configure how you receive payments from your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="bank"
            value={activePaymentMethod}
            onValueChange={setActivePaymentMethod}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="bank">Bank Account</TabsTrigger>
              <TabsTrigger value="paypal">PayPal</TabsTrigger>
            </TabsList>

            <TabsContent value="bank">
              <Form {...bankForm}>
                <form
                  onSubmit={bankForm.handleSubmit(onBankSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={bankForm.control}
                      name="accountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bankForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bankForm.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Bank of America" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bankForm.control}
                      name="routingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Routing Number</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bankForm.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">Save Bank Details</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="paypal">
              <Form {...paypalForm}>
                <form
                  onSubmit={paypalForm.handleSubmit(onPaypalSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={paypalForm.control}
                    name="paypalEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PayPal Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Save PayPal Details</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
