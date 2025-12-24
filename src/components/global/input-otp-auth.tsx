"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useOtpToken } from "@/hooks/useOtpToken";
import { useUserStore } from "@/store/user-store";
import { useState } from "react";

type InputOTPAuthProps = {
  handleSubmit: ({ token }: { token: string }) => Promise<void>;
  onOpenChange: (open: boolean) => void;
};

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function InputOTPForm({
  handleSubmit,
  onOpenChange,
}: InputOTPAuthProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const [btnText, setBtnText] = useState("Submit");

  const { verifyOtpTokenFn, verifyOtpTokenError } = useOtpToken();

  const user = useUserStore((state) => state.user);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsProcessing(true);

    setBtnText("...verifying otp");

    try {
      const res = await verifyOtpTokenFn({
        otp: data.pin,
        token: user?.token!,
        userId: user?.id!,
      });

      setBtnText("Otp verified");

      toast("Otp Token verified");

      setBtnText("..Updating user info");

      // submit the values
      await handleSubmit({ token: res.id });

      setBtnText("Updated user info");

      // close the modal
      onOpenChange(false);
      //! here we would grab the token from the res and attach it to request to update the user details!
      // console.log("RESPONSE FROM VERIFYING TOKEN", res);
    } catch (error) {
      // console.log(`Error verifying token ${verifyOtpTokenError?.message}`);
      toast(`Error verifying token ${verifyOtpTokenError?.message}`);
      // setIsProcessing(false);
    } finally {
      setBtnText("Submit");
      setIsProcessing(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isProcessing}>
          {btnText}
        </Button>
      </form>
    </Form>
  );
}
