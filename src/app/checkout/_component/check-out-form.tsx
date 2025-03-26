"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { Order } from "@/types/orders";
import { useOrder } from "@/hooks/useOrder";
import { toast } from "sonner";
import PaystackPop from "@paystack/inline-js";

const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
});

const deliverySchema = z.object({
  deliveryMethod: z.enum(["standard", "express", "overnight"], {
    required_error: "Please select a delivery method",
  }),
  specialInstructions: z.string().optional(),
});

const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const formSchema = addressSchema.merge(deliverySchema).merge(personalSchema);

type FormData = z.infer<typeof formSchema>;

type Props = {
  goToBilling: () => void;
};

export function CheckoutForm({ goToBilling }: Props) {
  const [activeTab, setActiveTab] = useState<
    "address" | "delivery" | "personal"
  >("personal");

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      deliveryMethod: "standard",
      specialInstructions: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    disabled: isLoading,
  });

  const { trigger, getValues } = form;

  const handleNext = async (nextTab: "address" | "delivery" | "personal") => {
    const fieldsToValidate = {
      address: ["streetAddress", "city", "state", "zipCode", "country"],
      delivery: ["deliveryMethod"],
      personal: ["firstName", "lastName", "email", "phone"],
    }[activeTab];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setActiveTab(nextTab);
    }
  };

  const handleBack = (previousTab: "address" | "delivery" | "personal") => {
    setActiveTab(previousTab);
  };

  const { cart } = useCartStore();
  const { user } = useUserStore();
  const { createOrderFn, createOrderError } = useOrder();

  async function onSubmit(values: FormData) {
    const order: Order = {
      buyer: user?.id!,
      items: cart.map((el) => {
        return {
          product: el.id,
          quantity: el.quantity,
        };
      }),
      shippingAddress: {
        city: values.city,
        country: values.country,
        state: values.state,
        street: values.streetAddress,
        zipCode: values.zipCode,
      },
    };

    setIsLoading(true);
    try {
      const res = await createOrderFn({
        data: order,
        token: user?.token!,
        userId: user?.id!,
      });

      toast.success("Order created!!");

      console.log(res);

      // const popup = new PaystackPop();

      // popup.checkout({
      //   key: 'pk_domain_xxxxxx',
      //   email: 'sample@email.com',
      //   amount: 23400,
      //   onSuccess: (transaction) => {
      //     console.log(transaction);
      //   },
      //   onLoad: (response) => {
      //     console.log("onLoad: ", response);
      //   },
      //   onCancel: () => {
      //     console.log("onCancel");
      //   },
      //   onError: (error) => {
      //     console.log("Error: ", error.message);
      //   }
      // })
      

      // popup.checkout({
      //   key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      //   email: user?.email!,
      //   amount: 10000,
      //   ref: res.paymentUrl.data.reference,
      //   onClose: () => {
      //     toast.error("Transaction cancelled");
      //   },
      //   callback: (response) => {
      //     toast.success("Transaction successful");
      //   },
      // });

      // const transactionRes = popup.resumeTransaction(
      //   res.paymentUrl.data.access_code
      // );
      // console.log("POPUP---TRANSACTION-DATA-----", transactionRes);

      // const { order: returnedOrder, paymentUrl } = res; // paymentUrl is the URL to redirect the user to for payment

      // Store order ID in localStorage for reference after payment
      // localStorage.setItem("pendingOrderId", returnedOrder._id);

      // Redirect to Paystack payment page
      window.location.href = res.paymentUrl.data.authorization_url;

    } catch (error) {
      toast.error(`Error creating order: ${createOrderError?.message}`);
    }
    setIsLoading(false);
  }

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal" disabled>
          Personal
        </TabsTrigger>
        <TabsTrigger value="address" disabled>
          Address
        </TabsTrigger>
        <TabsTrigger value="delivery" disabled>
          Delivery
        </TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TabsContent value="personal">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end mt-4">
              <Button type="button" onClick={() => handleNext("address")}>
                Next
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="address">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="10001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleBack("personal")}
              >
                Back
              </Button>
              <Button type="button" onClick={() => handleNext("delivery")}>
                Next
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="delivery">
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a delivery method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard (3-5 business days)
                      </SelectItem>
                      <SelectItem value="express">
                        Express (2-3 business days)
                      </SelectItem>
                      <SelectItem value="overnight">
                        Overnight (1 business day)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Input placeholder="Leave package at the door" {...field} />
                  </FormControl>
                  <FormDescription>
                    Any special instructions for the delivery (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleBack("address")}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "isProcessing..." : "Complete Order"}
              </Button>
            </div>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  );
}
