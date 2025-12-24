"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AddressBookMobile as AddressBookTabs } from "./user-address-book-dialog-mobile";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";
import useUserAddress from "@/hooks/useUserAddress";
import { useQueryClient } from "@tanstack/react-query";

export type Address = {
  id: string;
  label?: string | null;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  phoneNumber?: string;
  isDefault?: boolean;
};

const addressSchema = z.object({
  id: z.string(),
  label: z.string().optional().nullable(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export function AddressBookDialog({
  open,
  onOpenChange,
  addresses,
  // onSave,
  title = "Your Addresses",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  addresses: Address[];
  // onSave?: (values: AddressFormValues) => Promise<void> | void;
  title?: string;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    addresses?.[0]?.id ?? null
  );

  const [isChecked, setIsChecked] = React.useState<boolean>(false);

  const selected = React.useMemo(
    () => addresses.find((a) => a.id === selectedId) || addresses[0],
    [addresses, selectedId]
  );

  const user = useUserStore((state) => state.user);

  const { updateUserAddress, updateUserAddressError } = useUserAddress();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: selected
      ? {
          id: selected.id,
          label: selected.label ?? "",
          street: selected.street ?? "",
          city: selected.city ?? "",
          state: selected.state ?? "",
          country: selected.country ?? "",
          zipCode: selected.zipCode ?? "",
          phoneNumber: selected.phoneNumber ?? "",
          isDefault: !!selected.isDefault,
        }
      : undefined,
    mode: "onChange",
    disabled: !isChecked,
  });

  // When the selection changes, update form values
  React.useEffect(() => {
    if (!selected) return;
    form.reset({
      id: selected.id,
      label: selected.label ?? "",
      street: selected.street ?? "",
      city: selected.city ?? "",
      state: selected.state ?? "",
      country: selected.country ?? "",
      zipCode: selected.zipCode ?? "",
      phoneNumber: selected.phoneNumber ?? "",
      isDefault: !!selected.isDefault,
    });
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitting = form.formState.isSubmitting;

  const queryClient = useQueryClient();

  async function handleSubmit(values: AddressFormValues) {
    // await onSave?.(values);
    // keep dialog open so user can continue editing, or close here if you prefer:
    try {
      await updateUserAddress({
        addressId: selected.id,
        data: {
          city: values.city!,
          country: values.country!,
          state: values.state!,
          street: values.street!,
          zipCode: values.zipCode!,
        },
        userId: user?.id!,
        token: user?.token!,
      });
      queryClient.invalidateQueries({ queryKey: ["user-address", user?.id] });
      toast("Address Updated Successfully");
    } catch (error) {
      toast(`Error Occurred ${updateUserAddressError?.message}`);
    }
    // onOpenChange(false);
  }

  const handleCloseEditing = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-5xl max-w-[360px] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="md:hidden">
          <AddressBookTabs
            addresses={addresses}
            // onSave={onSave}
            title="Manage your addresses"
          />
        </div>

        <div className="hidden md:block">
          {/* existing two-column cards + form layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 pb-6">
            {/* Left: Address list */}
            <div className="md:col-span-5">
              <ScrollArea className="h-[60vh] pr-2">
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <Card
                      key={addr.id}
                      role="button"
                      onClick={() => setSelectedId(addr.id)}
                      className={cn(
                        "cursor-pointer transition",
                        selected?.id === addr.id
                          ? "border-2 bg-black/10 "
                          : "hover:border-black"
                      )}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>{addr.label || "Address"}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">
                              Default
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground space-y-1">
                        <p>{addr.street}</p>
                        <p>
                          {addr.city}, {addr.state}
                        </p>
                        <p>
                          {addr.country}
                          {addr.zipCode ? `, ${addr.zipCode}` : ""}
                        </p>
                        {addr.phoneNumber && <p>☎ {addr.phoneNumber}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right: Form */}
            <div className="md:col-span-7">
              <div className="flex items-center justify-end gap-2 mt-2">
                <Switch
                  id="editing-mode"
                  checked={isChecked}
                  onCheckedChange={handleCloseEditing}
                />
                <p className="text-xs text-black/50">Enable Editing Address</p>
              </div>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* <div>
                    <label className="text-xs text-muted-foreground">
                      Label
                    </label>
                    <Input
                      {...form.register("label")}
                      placeholder="Home / Office"
                    />
                  </div> */}
                  {/* <div>
                    <label className="text-xs text-muted-foreground">
                      Phone Number
                    </label>
                    <Input
                      {...form.register("phoneNumber")}
                      placeholder="+234..."
                    />
                  </div> */}
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground">
                      Street
                    </label>
                    <Input {...form.register("street")} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      City
                    </label>
                    <Input {...form.register("city")} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      State
                    </label>
                    <Input {...form.register("state")} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Country
                    </label>
                    <Input {...form.register("country")} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Zip Code
                    </label>
                    <Input {...form.register("zipCode")} />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                  <Button type="submit" disabled={submitting || !isChecked}>
                    {submitting ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
