"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { getUser, updateUserDetails } from "@/services/api/user";
import { useUserStore } from "@/store/user-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useUser from "@/hooks/useUser";

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

  const [isChecked, setIsChecked] = useState<boolean>(false);

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
      console.log(values);

      const response = await updateUser({
        userId: user?.id!,
        data: {
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber.toString(),
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            zipCode: values.zipcode,
            country: values.country,
          },
        },
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(`Please try again. ${updateUserError?.message}`);
    }
  }

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

          <section className="space-y-5">
            <h3 className="text-slate-100 font-medium text-sm bg-black px-2 py-1 w-fit rounded">
              Address Information
            </h3>
            <section className="space-y-5">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your street name"
                            type=""
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your city name"
                            type=""
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip code</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </section>

          <Button type="submit" disabled={!isChecked}>
            {isUpdatingUser ? "...Updating Record" : "Update Record"}
          </Button>
        </form>
      </Form>
    </section>
  );
}
