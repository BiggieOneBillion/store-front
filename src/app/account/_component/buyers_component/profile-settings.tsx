"use client";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/api/user";
import { useUserStore } from "@/store/user-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useUser from "@/hooks/useUser";
import { getUserAddress } from "@/services/api/user-address";
import { Address, AddressBookDialog } from "./user-address-book-dialog";
import AddressCreateDialog from "./create-user-address";
import { OtpDialogModal } from "./otp-dialog";

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipcode: z.string(),
});

export default function ProfileSettings() {
  const { user } = useUserStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUser(user?.id!, user?.token!),
  });

  const {
    data: userAddresses,
    isLoading: isLoadingUserAddresses,
    isError: errorLoadingUserAddresses,
  } = useQuery({
    queryKey: ["user-address", user?.id],
    queryFn: async () =>
      await getUserAddress({ userId: user?.id!, token: user?.token! }),
  });

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [openOtpModal, setOpenOtpModal] = useState(false);

  const { updateUser, isUpdatingUser, updateUserError } = useUser();

  const handleCloseEditing = () => {
    if (isChecked) {
      toast("Save changes", {
        description: "Closing editing mode, would not save changes.",
        action: {
          label: "Continue",
          onClick: () => setIsChecked(!isChecked),
        },
        position: "top-center",
      });
      return;
    }
    setIsChecked(!isChecked);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: data?.email,
      name: data?.name,
      city: "",
      state: "",
      street: "",
      country: "",
      phoneNumber: "",
      zipcode: "",
    },
    disabled: isLoading || !isChecked,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      // // console.log(values);

      await updateUser({
        userId: user?.id!,
        data: {
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber.toString(),
        },
      });
      toast.success("Profile updated successfully");
      // show dialog for otp mode
      setOpenOtpModal(true);
    } catch (error) {
      toast.error(`Please try again. ${updateUserError?.message}`);
    }
  }

  const [addressOpen, setAddressOpen] = useState(false);
  const [createAddressOpen, setCreateAddressOpen] = useState(false);

  // optional: normalize addresses from your API shape to AddressBookDialog shape
  const normalizedAddresses: Address[] =
    (userAddresses || []).map((a: any) => ({
      id: String(a.id ?? a._id ?? a.addressId),
      label: a.label ?? a.tag ?? null,
      street: a.street ?? a.address?.street ?? "",
      city: a.city ?? a.address?.city ?? "",
      state: a.state ?? a.address?.state ?? "",
      country: a.country ?? a.address?.country ?? "",
      zipCode: a.zipCode ?? a.address?.zipCode ?? "",
      phoneNumber: a.phoneNumber ?? data?.phoneNumber ?? "",
      isDefault: !!a.isDefault,
    })) ?? [];

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        email: data.email,
        phoneNumber: data?.phoneNumber || 0,
        street: data?.address?.street || "",
        city: data?.address?.city || "",
        state: data?.address?.state || "",
        zipcode: data?.address?.zipCode || "",
        country: data?.address?.country || "",
      });
    }
  }, [data]);

  if (isError) {
    toast("Error fetching user data", {
      description: "Could not fetch your data, Please Try again",
      action: {
        label: "Continue",
        onClick: () => window.location.reload(),
      },
    });
  }

  if (isLoading) {
    return <p className="mt-20 w-full text-center">...Loading</p>;
  }

  return (
    <section className="flex flex-col gap-4 mt-3">
      <section className="space-y-1">
        <p className="text-sm text-slate-400">
          Click on the switch to enable editing of your profile settings
        </p>
        <div className="flex items-center space-x-2">
          <Switch
            id="editing-mode"
            checked={isChecked}
            onCheckedChange={handleCloseEditing}
          />
          <Label htmlFor="editing-mode">Editing Mode</Label>
        </div>
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 h-fit max-w-4xl w-full mx-autoy py-5 bg-white/30 p-5 border border-black/5 rounded-md mt-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="" type="" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
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
                  <Input placeholder="" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  This is your email to recieve notifications
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="" type="number" {...field} />
                </FormControl>
                <FormDescription>Enter your phone number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isLoadingUserAddresses && <p>...Loading address</p>}
          {errorLoadingUserAddresses && (
            <p className="text-red-500">Error loading address</p>
          )}

          {userAddresses && userAddresses.length > 0 ? (
            <div className="flex items-center justify-start gap-4">
              <p className="text-sm text-black text-opacity-50">
                You have {userAddresses.length} saved address
                {userAddresses.length > 1 ? "es" : ""}
              </p>
              <Button
                type="button"
                size="sm"
                disabled={!isChecked}
                onClick={() => setAddressOpen(true)}
              >
                Your Address
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!isChecked}
                onClick={() => setCreateAddressOpen(true)}
              >
                Add Address
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-start gap-4">
              <p className="text-sm text-black text-opacity-50">
                You have no saved address
              </p>
              <Button
                type="button"
                size="sm"
                disabled={!isChecked}
                onClick={() => setCreateAddressOpen(true)}
              >
                Click to save
              </Button>
            </div>
          )}

          <Button type="submit" disabled={!isChecked}>
            {isUpdatingUser ? "...Updating Record" : "Update Record"}
          </Button>
        </form>
      </Form>
      {/* Dialog */}
      <AddressBookDialog
        open={addressOpen}
        onOpenChange={setAddressOpen}
        addresses={normalizedAddresses}
        title="Manage your addresses"
      />
      <AddressCreateDialog
        open={createAddressOpen}
        onOpenChange={setCreateAddressOpen}
        title="Add a new address"
      />
      <OtpDialogModal
        form={form}
        open={openOtpModal}
        onOpenChange={setOpenOtpModal}
      />
    </section>
  );
}
