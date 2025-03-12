"use client";
import { useEffect, useState, useTransition } from "react";
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
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/extension/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/api/user";
import { getUserStore } from "@/services/api/store";
import { useStore } from "@/hooks/useStore";
import Image from "next/image";

const formSchema = z.object({
  storename: z.string(),
  email: z.string(),
  storePhoneNumber: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipcode: z.string(),
  logoImage: z.string(),
  storeDescription: z.string(),
});

export default function StoreSettingsForm() {
  const [files, setFiles] = useState<File[] | null>(null);

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { user } = useUserStore();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["store-details"],
    queryFn: async () => await getUserStore(user?.id!, user?.token!),
  });

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: !isChecked,
    defaultValues: {
      storename: "",
      email: "",
      storePhoneNumber: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      logoImage: "",
      storeDescription: "",
    },
  });

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

  const [isPending, startTransition] = useTransition();

  const { updateStore, updateStoreError } = useStore();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const input = {
      name: values.storename,
      description: values.storeDescription,
      logo: (files && files[0]) || data?.logoImage,
      contactEmail: values.email,
      contactPhone: `${values.storePhoneNumber}`,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        country: values.country,
        zipCode: values.zipcode,
      },
    };
    startTransition(async () => {
      try {
        await updateStore({
          token: user?.token!,
          userId: user?.id!,
          data: input,
        });

        toast.success("Store records updated");

        refetch();

        setIsChecked(!isChecked);
      } catch (error) {
        console.error("Form submission error", error);
        toast.error(`Failed to submit the form: ${updateStoreError?.message}`);
      }
    });
  }

  useEffect(() => {
    if (data) {
      form.reset({
        storename: data?.name || "",
        email: data?.contactEmail || "",
        storePhoneNumber: data?.contactPhone,
        street: data?.address.street || "",
        city: data?.address.city || "",
        state: data?.address.state || "",
        country: data?.address.country || "",
        zipcode: data?.address.zipCode || "",
        logoImage: data?.logoImage || "",
        storeDescription: data?.description || "",
      });
    }
  }, [data]);

  if (isError) {
    toast("Error fetching user data", {
      description: "Could not fetch your data, Please Try again",
      action: {
        label: "Refetch",
        onClick: () => window.location.reload(),
      },
    });
  }

  if (isLoading) {
    return <p className="mt-20 w-full text-center">...Loading</p>;
  }

  return (
    <section className="space-y-5">
      <section>
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
          className="space-y-8 max-w-3xl p-4 border rounded-md py-10y"
        >
          <FormField
            control={form.control}
            name="storename"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <Input placeholder="" type="" {...field} />
                </FormControl>
                <FormDescription>
                  This is the store public display name.
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
            name="storePhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="" type="tel" {...field} />
                </FormControl>
                <FormDescription>
                  This is the store public display customer care line
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="grid grid-cols-2">
            <FormField
              control={form.control}
              name="logoImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Logo Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={setFiles}
                      dropzoneOptions={dropZoneConfig}
                      className="relative bg-background rounded-lg p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className={`outline-dashed outline-1 outline-slate-500 ${
                          !isChecked && "cursor-none pointer-events-none"
                        }`}
                      >
                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                          <CloudUpload className="text-gray-500 w-10 h-10" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  <FormDescription>Select a file to upload.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full h-full overflow-hidden rounded-md">
              <Image
                src={data?.logo || ""}
                alt="store-logo"
                width={100}
                height={100}
                className="h-full w-full"
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="storeDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter store description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Tell the world what you sell</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!isChecked || isPending}>
            {isPending ? "...updating" : "Update"}
          </Button>
        </form>
      </Form>
    </section>
  );
}
