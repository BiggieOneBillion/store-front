import { createStock, CreateStockData } from "@/services/api/inventory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInventory = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createStockFn,
    isPending: isCreatingStock,
    error: createStockError,
  } = useMutation({
    mutationFn: async (params: { token: string; data: CreateStockData }) =>
      createStock(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockHistory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stock updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update stock");
      console.error("Update stock error:", error);
    },
  });

  return {
    // create stock entry
    createStockFn,
    isCreatingStock,
    createStockError,
  };
};
