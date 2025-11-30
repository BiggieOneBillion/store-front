"use client";
import { Dispatch, SetStateAction, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { SquareX } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().min(1),
});

type ForgotPasswordFormType = {
  setShowResetPassword: Dispatch<SetStateAction<boolean>>;
};

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const { forgotPasswordFn, forgotPasswordError, isforgotPassword } = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // console.log(values);
      // toast(
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      //   </pre>
      // );

      await forgotPasswordFn({ email: values.email });

      toast("Check Your Email For The Token");

      setShowSuccess(true);
    } catch (error) {
      // console.error("Form submission error", error);
      toast.error(
        `Failed to submit the form. Please try again. ${forgotPasswordError?.message}`
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
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your email for verification</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="" {...field} />
              </FormControl>
              <FormDescription>
                A code would be sent to this email. Check your email for the
                code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="w-full" disabled={isforgotPassword}>
            {isforgotPassword ? "...loading" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
