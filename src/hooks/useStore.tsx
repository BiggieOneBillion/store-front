import { createUserStore, IStore, updateUserStore } from "@/services/api/store";
import { useMutation } from "@tanstack/react-query";

export const useStore = () => {
  const {
    mutateAsync: createStore,
    isPending: isCreatingStore,
    error: createStoreError,
  } = useMutation({
    mutationFn: async (params: {
      token: string;
      data: IStore;
      userId: string;
    }) => createUserStore(params),
  });

  const {
    mutateAsync: updateStore,
    isPending: isUpdatingStore,
    error: updateStoreError,
  } = useMutation({
    mutationFn: async (params: {
      token: string;
      data: Partial<IStore>;
      userId: string;
    }) => updateUserStore(params),
  });

  return {
    // create store
    createStore,
    isCreatingStore,
    createStoreError,
    // update store values
    updateStore,
    isUpdatingStore,
    updateStoreError,
  };
};
