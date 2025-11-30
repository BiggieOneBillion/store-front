"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/useAuth";
import { SquareX } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  new_password: z.string(),
  confirm_password: z.string(),
});

type ResetPasswordFormType = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormType) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const { resetPasswordFn, resetPasswordError, isResettingPassword } =
    useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
      const res = await resetPasswordFn({
        password: values.confirm_password,
        token: token,
      });

      // console.log("RESPONSE FROM RESET PASSWORD", res);

      toast("Password Reset Successfully");
      // move to another page or display text, telling user to redirect to another page
      setShowSuccess(true);
    } catch (error) {
      // console.error("Form submission error", error);

      toast.error(
        `Failed to submit the form. Please try again. ${resetPasswordError?.message}`
      );
    }
  }

  if (showSuccess) {
    return (
      <section className="flex items-center justify-center gap-1">
        <span>You can now close this page</span>
        <SquareX size={16} />
        <span>And go the home page</span>
        <Link href={"/"} className="underline">
          Home
        </Link>
      </section>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl w-[360px] md:w-[400px] mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter your password" {...field} />
              </FormControl>
              <FormDescription>Enter your new password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Re-enter your password"
                  {...field}
                />
              </FormControl>
              <FormDescription>Confirm your password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isResettingPassword}>
          {isResettingPassword ? "...processing" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
