import { Product } from "@/app/account/dashboard/product-management/_component/columns";
import api from "@/lib/api";
import { Order } from "@/types/orders";

const baseURL = "/order";

export const getAllOrders = async (storeId: string, token: string) => {
  const response = await api.get(`${baseURL}/${storeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// export const getStoreProduct = async (userId: string, token: string) => {
//   const response = await api.get(`${baseURL}/${userId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });
//   return response.data;
// };

export const createOrder = async (params: { token: string; data: Order }) => {
  const response = await api.post(
    `${baseURL}`,
    { ...params.data },
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    }
  );
  return response.data;
};

// Get all the orders of a user
export const getUsersOrder = async (params: { token: string }) => {
  const response = await api.get(`${baseURL}`, {
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  });
  return response.data;
};

// Get a single order of a user
export const getSingleOrder = async (params: {
  token: string;
  orderId: string;
}) => {
  const response = await api.get(`${baseURL}/${params.orderId}`, {
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  });
  return response.data;
};

// export const updateProduct = async (params: {
//   token: string;
//   data: Partial<IProduct>;
//   userId: string;
//   productId: string;
// }) => {
//   const response = await api.patch(
//     `${baseURL}/${params.userId}/${params.productId}`,
//     { ...params.data },
//     {
//       headers: {
//         Authorization: `Bearer ${params.token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
//   return response.data;
// };

export const deleteProduct = async (params: {
  token: string;
  userId: string;
  productId: string;
}) => {
  const response = await api.delete(
    `${baseURL}/${params.userId}/${params.productId}`,
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    }
  );
  return response.data;
};

// get all the products to display in the main website
export const getAllStoreProducts = async (
  token: string
): Promise<Product[]> => {
  const response = await api.get(`${baseURL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
