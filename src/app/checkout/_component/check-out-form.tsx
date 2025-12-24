"use client";

import React, { useEffect, useState, useTransition } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/api/user";
import UpdateDetails from "./update-details";
import { SaveAddressDialog } from "./save-address-dialog";
import { getUserAddress } from "@/services/api/user-address";
import { Loader2 } from "lucide-react";
import Loader from "./loader";

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

export type FormData = z.infer<typeof formSchema>;

type Props = {
  goToBilling: () => void;
};

export function CheckoutForm({ goToBilling }: Props) {
  const [activeTab, setActiveTab] = useState<
    "address" | "delivery" | "personal"
  >("personal");

  const [isLoading, setIsLoading] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [paymentUrl, setPaymentUrl] = useState("");

  const { user } = useUserStore();

  const { cart } = useCartStore();

  const { createOrderFn, createOrderError } = useOrder();

  const [hasNoSavedAdress, setHasNoSavedAdress] = useState<boolean>(false);

  // 1. Fetch user details from backend
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () => await getUser(user?.id!, user?.token!),
    enabled: !!user?.id && !!user?.token,
  });

  const { data: userAddressData, isLoading: isLoadingUserAddresses } = useQuery(
    {
      queryKey: ["user-address", user?.id],
      queryFn: async () =>
        getUserAddress({ userId: user?.id!, token: user?.token! }),
    }
  );

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

  // Prefill form when userData is loaded
  React.useEffect(() => {
    if (userData) {
      form.reset({
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        firstName: userData.name || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phoneNumber || "",
        deliveryMethod: "standard",
        specialInstructions: "",
      });
    }
  }, [userData]);

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

  async function onSubmit(values: FormData) {
    setIsProcessing(true);
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

      setPaymentUrl(res.paymentUrl.data.authorization_url);
      setIsProcessing(false);
      if (hasNoSavedAdress) {
        setIsOpen(true); //! if user has no saved address then let the save address modal open to give the user the option of saving the address.
      } else {
        window.location.href = res.paymentUrl.data.authorization_url;
      }
    } catch (error) {
      // // console.log("THE WARRIOR WITHIN", createOrderError);
      toast.error(`Error creating order: ${createOrderError?.message}`);
    } finally {
      setIsProcessing(false);
    }
    setIsLoading(false);
  }

  // useEffect(() => {
  //   if (userAddressData && userAddressData.length > 0) {
  //     setHasNoSavedAdress(false); // meaning the user has addresses saved already.
  //   } else {
  //     setHasNoSavedAdress(true); // user has no address saved.
  //   }
  // }, []);

  if (isUserLoading || isLoadingUserAddresses) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading user data...</p>
      </div>
    );
  }

  // // console.log("USER ADDRESS LIST", userAddressData);

  if (userAddressData && userAddressData.length > 0) {
    return (
      <>
        <UpdateDetails
          setValue={form.setValue}
          onSubmit={() => onSubmit(form.getValues())}
        />
        <SaveAddressDialog
          address={{
            street: getValues("streetAddress"),
            city: getValues("city"),
            state: getValues("state"),
            zipCode: getValues("zipCode"),
            country: getValues("country"),
          }}
          paymentUrl={paymentUrl}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setHasNoSavedAdress={setHasNoSavedAdress}
        />
        <Loader condition={isProcessing} />
      </>
    );
  }

  return (
    <>
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
                      <Input
                        type="tel"
                        placeholder="(123) 456-7890"
                        {...field}
                      />
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
                      <Input
                        placeholder="Leave package at the door"
                        {...field}
                      />
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
      <SaveAddressDialog
        address={{
          street: getValues("streetAddress"),
          city: getValues("city"),
          state: getValues("state"),
          zipCode: getValues("zipCode"),
          country: getValues("country"),
        }}
        paymentUrl={paymentUrl}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setHasNoSavedAdress={setHasNoSavedAdress}
      />
      <Loader condition={isProcessing} />
    </>
  );
}
