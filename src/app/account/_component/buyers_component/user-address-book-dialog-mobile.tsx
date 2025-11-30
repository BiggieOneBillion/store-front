"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
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

export function AddressBookMobile({
  addresses,
  // onSave,
  className,
  initialSelectedId,
  title = "Your Addresses",
}: {
  addresses: Address[];
  // onSave?: (values: AddressFormValues) => Promise<void> | void;
  className?: string;
  initialSelectedId?: string;
  title?: string;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    initialSelectedId ?? addresses?.[0]?.id ?? null
  );

  const selected = React.useMemo(
    () => addresses.find((a) => a.id === selectedId) || addresses[0],
    [addresses, selectedId]
  );

  const [isChecked, setIsChecked] = React.useState<boolean>(false);

  const handleCloseEditing = () => {
    setIsChecked(!isChecked);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const submitting = form.formState.isSubmitting;

  const queryClient = useQueryClient();

  const user = useUserStore((state) => state.user);

  const { updateUserAddress, updateUserAddressError } = useUserAddress();

  async function handleSubmit(values: AddressFormValues) {
    // await onSave?.(values);
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
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="px-4 pt-3y pb-4">
        <h3 className="text-base font-medium">{title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Switch
            id="editing-mode"
            checked={isChecked}
            onCheckedChange={handleCloseEditing}
          />
          <p className="text-xs text-black/50">Enable Editing Address</p>
        </div>
      </div>

      {/* Two columns on mobile: left = buttons, right = form */}
      <div className="grid grid-cols-12 gap-4 px-4 pb-4">
        {/* Left: numbered buttons */}
        <div className="col-span-2">
          <ScrollArea className="h-[60vh] pr-1">
            <div className="flex flex-col gap-2">
              {addresses.map((addr, idx) => {
                const isActive = addr.id === selected?.id;
                return (
                  <Button
                    key={addr.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={cn("justify-center", isActive ? "" : "bg-white")}
                    onClick={() => setSelectedId(addr.id)}
                  >
                    {idx + 1}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right: form */}
        <div className="col-span-10">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3"
          >
            {/* <div>
              <label className="text-xs text-muted-foreground">Label</label>
              <Input {...form.register("label")} placeholder="Home / Office" className="h-8 text-sm" />
            </div> */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Street</label>
                <Input {...form.register("street")} className="h-8 text-sm" />
              </div>
              <div className="flex flex-col">
                <div>
                  <label className="text-xs text-muted-foreground">City</label>
                  <Input {...form.register("city")} className="h-8 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">State</label>
                  <Input {...form.register("state")} className="h-8 text-sm" />
                </div>
              </div>
              <div className="flex flex-col">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Country
                  </label>
                  <Input
                    {...form.register("country")}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Zip Code
                  </label>
                  <Input
                    {...form.register("zipCode")}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Phone</label>
                <Input
                  {...form.register("phoneNumber")}
                  placeholder="+234..."
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button type="submit" disabled={submitting || !isChecked}>
                {submitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
