"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { addUserAddress } from "@/services/api/user-address";
import { useUserStore } from "@/store/user-store";
import useUserAddress from "@/hooks/useUserAddress";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const AddressCreateSchema = z.object({
  label: z.string().optional().nullable(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type NewAddress = z.infer<typeof AddressCreateSchema>;

export default function AddressCreateDialog({
  open,
  onOpenChange,
  //   onCreate,
  title = "Add a new address",
  description = "Fill in the form to save a new address to your profile.",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  //   onCreate: (values: NewAddress) => Promise<void> | void;
  title?: string;
  description?: string;
}) {
  const form = useForm<NewAddress>({
    resolver: zodResolver(AddressCreateSchema),
    defaultValues: {
      label: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      phoneNumber: "",
      isDefault: false,
    },
    mode: "onSubmit",
  });

  const submitting = form.formState.isSubmitting;

  const id = useUserStore((state) => state.user?.id);
  const token = useUserStore((state) => state.user?.token);
  const { addUserAddress, addUserAddressError } = useUserAddress();

  const queryClient = useQueryClient();

  async function handleSubmit(values: NewAddress) {
    // await onCreate(values);
    // reset and close on success
    try {
      await addUserAddress({
        userId: id!,
        token: token!,
        data: {
          city: values.city,
          country: values.country,
          state: values.state,
          street: values.street,
          zipCode: values.zipCode!,
        },
      });
      toast.success("Address added successfully");
      queryClient.invalidateQueries({ queryKey: ["user-address", id] });
      form.reset({
        label: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        phoneNumber: "",
        isDefault: false,
      });
    } catch (error) {
      toast.error(`Failed to add address: ${addUserAddressError?.message}`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Home / Office" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+234..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="Street name, number" {...field} />
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
                      <Input placeholder="City" {...field} />
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
                      <Input placeholder="State" {...field} />
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
                      <Input placeholder="Country" {...field} />
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
                    <FormLabel>Zip code (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Postal / ZIP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="m-0">Set as default address</FormLabel>
                  <FormControl>
                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save address"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
