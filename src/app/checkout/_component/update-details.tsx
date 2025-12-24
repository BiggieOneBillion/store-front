"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserAddress } from "@/services/api/user-address";

import { useUserStore } from "@/store/user-store";
import useUserAddress from "@/hooks/useUserAddress";
import { UseFormSetValue } from "react-hook-form";
import { FormData } from "./check-out-form";

const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
});

type Address = z.infer<typeof addressSchema>;

type UpdateDetailsProps = {
  onSubmit: () => void;
  setValue: UseFormSetValue<FormData>;
};

type addressType = {
  address: Address;
};

const UpdateDetails = ({ onSubmit, setValue }: UpdateDetailsProps) => {
  const [selected, setSelected] = useState<"existing" | "new">("existing");
  const [showModal, setShowModal] = useState(false);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState<number | null>(
    null
  );
  const queryClient = useQueryClient();

  const user = useUserStore((state) => state.user);

  const { addUserAddress, updateUserAddressError } = useUserAddress();

  const { data: userAddressData, isLoading: isLoadingUserAddresses } = useQuery(
    {
      queryKey: ["user-address", user?.id],
      queryFn: async () =>
        getUserAddress({ userId: user?.id!, token: user?.token! }),
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const handleAddDetails = () => setShowModal(true);

  const handleAddressSubmit = async (values: Address) => {
    try {
      const res = await addUserAddress({
        userId: user?.id!,
        token: user?.token!,
        data: {
          city: values.city,
          country: values.country,
          state: values.state,
          street: values.streetAddress,
          zipCode: values.zipCode,
        },
      });

      // console.log("User updated successfully:", res);
      setAddresses((prev) => [...prev, values]);
      reset();
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["user-address", user?.id] }); // refetch the addresses
      toast.success("Address added!");
    } catch {
      toast.error("Failed to save address");
      // console.log("Error updating user:", updateUserAddressError);
    }
  };

  const handleSelectAddress = (idx: number) => {
    setSelectedAddressIdx(idx);
    const address = userAddressData[idx].address;
    setValue("streetAddress", address.street);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("zipCode", address.zipCode);
    setValue("country", address.country);
  };

  const handleProceed = () => {
    if (selectedAddressIdx !== null) {
      // You can update the user's address here if needed
      onSubmit();
    } else {
      toast.error("Please select an address to continue.");
    }
  };

  const handleProceedExisting = () => {
    if (selectedAddressIdx !== null) {
      setShowAddressSelector(false);
      onSubmit();
    } else {
      toast.error("Please select an address to continue.");
    }
  };

  // useEffect(() => {
  //   if (userAddressData && userAddressData > 0) {
  //     const address = userAddressData[selectedAddressIdx!];
  //     setValue("streetAddress", address.streetAddress);
  //     setValue("city", address.city);
  //     setValue("state", address.state);
  //     setValue("zipCode", address.zipCode);
  //     setValue("country", address.country);
  //   }
  // }, [userAddressData, selectedAddressIdx]);

  // // console.log("WINTER IS HERE", userAddressData);

  return (
    <section>
      <div className="flex flex-col gap-6">
        <Card
          className={`cursor-pointer border-2 transition-colors ${
            selected === "existing"
              ? "border-primary ring-1 ring-primary"
              : "border-muted"
          }`}
          onClick={() => setSelected("existing")}
          tabIndex={0}
          role="button"
          aria-pressed={selected === "existing"}
        >
          <CardContent className="flex items-center gap-4 py-6">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === "existing" ? "border-primary" : "border-muted"
              }`}
            >
              {selected === "existing" && (
                <div className="w-3 h-3 rounded-full bg-primary" />
              )}
            </div>
            <div>
              <Label className="text-base font-medium">
                Use Existing Details
              </Label>
              <div className="text-sm text-muted-foreground">
                Use your saved address and contact information.
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer border-2 transition-colors ${
            selected === "new"
              ? "border-primary ring-1 ring-primary"
              : "border-muted"
          }`}
          onClick={() => setSelected("new")}
          tabIndex={0}
          role="button"
          aria-pressed={selected === "new"}
        >
          <CardContent className="flex items-center gap-4 py-6">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === "new" ? "border-primary" : "border-muted"
              }`}
            >
              {selected === "new" && (
                <div className="w-3 h-3 rounded-full bg-primary" />
              )}
            </div>
            <div>
              <Label className="text-base font-medium">Add New Address</Label>
              <div className="text-sm text-muted-foreground">
                Enter a new address and contact details for this order.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* button container */}
      <section className="mt-6 flex justify-end">
        {selected === "existing" && (
          <Button
            variant={"default"}
            onClick={() => setShowAddressSelector(true)}
            disabled={isLoadingUserAddresses}
          >
            {isLoadingUserAddresses
              ? "...Loading your addresses"
              : "Continue To Payment"}
          </Button>
        )}
        {selected === "new" && (
          <Button variant={"default"} onClick={handleAddDetails}>
            Add Details
          </Button>
        )}
      </section>

      {/* Modal for adding new address */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleAddressSubmit)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input id="streetAddress" {...register("streetAddress")} />
              {errors.streetAddress && (
                <span className="text-xs text-red-600">
                  {errors.streetAddress.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <span className="text-xs text-red-600">
                  {errors.city.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
              {errors.state && (
                <span className="text-xs text-red-600">
                  {errors.state.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input id="zipCode" {...register("zipCode")} />
              {errors.zipCode && (
                <span className="text-xs text-red-600">
                  {errors.zipCode.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
              {errors.country && (
                <span className="text-xs text-red-600">
                  {errors.country.message}
                </span>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                Update
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal for selecting existing address */}
      <Dialog open={showAddressSelector} onOpenChange={setShowAddressSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Address</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {userAddressData &&
              userAddressData.map((address: addressType, idx: number) => (
                <Card
                  key={idx}
                  className={`cursor-pointer border-2 bg-zinc-50 shadow-none transition-colors ${
                    selectedAddressIdx === idx
                      ? "border-primary ring-1 ring-primary"
                      : "border-muted"
                  }`}
                  onClick={() => handleSelectAddress(idx)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedAddressIdx === idx}
                >
                  <CardContent className="py-4">
                    <div className="font-medium">
                      {address.address.streetAddress}
                    </div>
                    <div className="text-sm text-muted-foreground grid grid-cols-2 gap-1">
                      <span>
                        <b>City:</b> {address.address.city}
                      </span>

                      <span>
                        <b>State:</b> {address.address.state}
                      </span>

                      <span>
                        <b>Zip Code:</b> {address.address.zipCode}
                      </span>

                      <span>
                        <b>Country:</b> {address.address.country}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          <DialogFooter>
            <Button
              variant="default"
              onClick={handleProceedExisting}
              disabled={selectedAddressIdx === null}
            >
              Proceed
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default UpdateDetails;
