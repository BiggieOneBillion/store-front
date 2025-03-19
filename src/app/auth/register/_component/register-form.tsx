"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Store } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

// Define validation schema using Zod
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z
      .string()
      .min(11, { message: "Phone number must be 11 digits" })
      .max(11, { message: "Phone number must be 11 digits" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });

  const { register, isRegistering, registerError } = useAuth();

  const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Assuming an async registration function
      const { confirmPassword, ...others } = values;
      // register the user
      const response = await register({
        ...others,
        role: "buyer",
      });

      setUser({
        id: response.user.id,
        name: response.user.name,
        role: response.user.role,
        email: response.user.email,
        token: response.tokens.access.token,
        refreshToken: response.tokens.refresh.token,
      });

      router.push("/");
      toast.success("Registration Completed");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(
        `Error Registering ${
          registerError?.message
        }`
      );
    }
  }

  return (
    <div className="flex flex-col gap-4 min-h-[60vh] h-full w-full items-center justify-center px-4">
      <h1 className="flex items-center gap-2">
        <Store size={16} />
        <span>STOREFRONT</span>
      </h1>
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Create a new account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name">Full Name</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* phone number Field */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          id="phoneNumber"
                          placeholder="09087654321"
                          type="tel"
                          autoComplete="phoneNumber"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

            
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isRegistering}
                >
                  Register
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
