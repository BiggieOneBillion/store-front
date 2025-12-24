import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useUser from "@/hooks/useUser";
import useUserAddress from "@/hooks/useUserAddress";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";

type Prop = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHasNoSavedAdress: React.Dispatch<React.SetStateAction<boolean>>;
  paymentUrl?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
};

export function SaveAddressDialog({
  isOpen,
  setIsOpen,
  paymentUrl,
  address,
  setHasNoSavedAdress,
}: Prop) {
  const handleUpdateState = (value: boolean) => {
    // // console.log("Dialog state updated:", value);
    setIsOpen(value);
    window.location.href = paymentUrl!;
  };
  const { updateUser, updateUserError } = useUser();
  const id = useUserStore((state) => state.user?.id);
  const token = useUserStore((state) => state.user?.token);

  const { addUserAddress } = useUserAddress();
  //! when the user clicks on the continue button, it should save the address and close the dialog
  const handleContinue = async () => {
    try {
      // Logic to save the address
      const res = await addUserAddress({
        userId: id!,
        token: token!,
        data: {
          ...address,
        },
      });
      // // console.log("User updated successfully:", res);
      // Logic to save the address goes here
      toast.success("Address saved successfully");
      // You can also call setIsOpen(false) here if you want to close the dialog after saving the address
      // close the modal
      setIsOpen(false);

      // Assuming paymentUrl is the URL to redirect to after saving the address
      window.location.href = paymentUrl!;
    } catch {
      toast.error("Failed to save address");
      // console.log("Error updating user:", updateUserError);
    } finally {
      setHasNoSavedAdress(false);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={handleUpdateState}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Address Saving</AlertDialogTitle>
          <AlertDialogDescription>
            Save your address to use for future checkouts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
