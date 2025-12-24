import { InputOTPForm } from "@/components/global/input-otp-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUser from "@/hooks/useUser";
import { useUserStore } from "@/store/user-store";
import { get } from "http";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

type OtpDialogModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<
    {
      name: string;
      email: string;
      phoneNumber: string;
      street: string;
      city: string;
      state: string;
      country: string;
      zipcode: string;
    },
    any,
    undefined
  >;
};

export function OtpDialogModal({
  open,
  onOpenChange,
  form,
}: OtpDialogModalProps) {
  const { updateUser, updateUserError } = useUser();
  const user = useUserStore((state) => state.user);
  const { getValues } = form;

  const handleSubmit = async ({ token }: { token: string }) => {
    try {
      await updateUser({
        userId: user?.id!,
        data: {
          name: getValues("name"),
          email: getValues("email"),
          phoneNumber: getValues("phoneNumber"),
          token,
        },
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      // console.error("Form submission error", error);
      toast.error(`Please try again. ${updateUserError?.message}`);
    }
  };

  return (
    <Dialog open={open}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <section className="flex items-center justify-center">
          <InputOTPForm
            onOpenChange={onOpenChange}
            handleSubmit={handleSubmit}
          />
        </section>
      </DialogContent>
    </Dialog>
  );
}
