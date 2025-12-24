import { IUserAddress } from "@/services/api/user-address";
import { useUserStore } from "@/store/user-store";
import { useMutation } from "@tanstack/react-query";
import {
  addUserAddress as add,
  updateUserAddress as update,
  deleteUserAddress as remove,
} from "@/services/api/user-address";

const useUserAddress = () => {
  const {
    mutateAsync: addUserAddress,
    isPending: isAddingUserAddress,
    error: addUserAddressError,
  } = useMutation({
    mutationFn: async (params: {
      userId: string;
      data: IUserAddress;
      token: string;
    }) => add({ ...params }),
  });

  const {
    mutateAsync: updateUserAddress,
    isPending: isUpdatingUserAddress,
    error: updateUserAddressError,
  } = useMutation({
    mutationFn: async (params: {
      userId: string;
      data: Partial<IUserAddress>;
      token: string;
      addressId: string;
    }) => update({ ...params }),
  });

  // Delete user address
  const {
    mutateAsync: deleteUserAddress,
    isPending: isDeletingUserAddress,
    error: deleteUserAddressError,
  } = useMutation({
    mutationFn: async (params: { userId: string; addressId: string }) =>
      remove({ ...params }),
  });

  return {
    // Adding,
    addUserAddress,
    isAddingUserAddress,
    addUserAddressError,
    // updating
    updateUserAddress,
    isUpdatingUserAddress,
    updateUserAddressError,
    // deleting
    deleteUserAddress,
    isDeletingUserAddress,
    deleteUserAddressError,
  };
};

export default useUserAddress;
