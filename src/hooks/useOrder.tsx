import { createOrder } from "@/services/api/order";
import { Order } from "@/types/orders";
  import { useMutation } from "@tanstack/react-query";
  
  export const useOrder = () => {
    const {
      mutateAsync: createOrderFn,
      isPending: isCreatingOrder,
      error: createOrderError,
    } = useMutation({
      mutationFn: async (params: {
        token: string;
        data: Order;
        userId: string;
      }) => createOrder(params),
    });
  
    // const {
    //   mutateAsync: fetchUserOrder,
    //   isPending: isfetchUserOrder,
    //   error: fetchUserOrderError,
    // } = useMutation({
    //   mutationFn: async (params: {
    //     token: string;
    //     data: Partial<IProduct>;
    //     userId: string;
    //     productId: string;
    //   }) => updateProduct(params),
    // });
  
    // const {
    //   mutateAsync: deleteProductFn,
    //   isPending: isDeletingProduct,
    //   error: deleteProductError,
    // } = useMutation({
    //   mutationFn: async (params: {
    //     token: string;
    //     userId: string;
    //     productId: string;
    //   }) => deleteProduct(params),
    // });
  
    return {
      // create order
      createOrderFn,
      isCreatingOrder,
      createOrderError,
     
    };
  };