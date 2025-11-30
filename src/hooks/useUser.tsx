import { IUser, updateUserDetails, IUserUpdate } from "@/services/api/user";
import { useUserStore } from "@/store/user-store";
import { useMutation } from "@tanstack/react-query";

export default function useUser() {
  
  const { user } = useUserStore();

  const {
    mutateAsync: updateUser,
    isPending: isUpdatingUser,
    error: updateUserError,
  } = useMutation({
    mutationFn: async (params: { userId: string; data: Partial<IUserUpdate> }) =>
      updateUserDetails({ ...params, token: user?.token! }),
  });

  

  return {
    updateUser,
    isUpdatingUser,
    updateUserError,
  };
}
