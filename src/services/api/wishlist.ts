import api from "@/lib/api";
import { useUserStore } from "@/store/user-store";

const baseURL = "/wishlist";

const user = useUserStore.getState().user;

export interface IWishList {
  productId: string;
}

export const getUserWishList = async (userId: string, token: string) => {
  const response = await api.get(`${baseURL}?user=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const addWishList = async (wishList: IWishList, token: string) => {
  const response = await api.post(`${baseURL}`, wishList, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// for removing specific product from wishlist
export const deleteUserWishList = async (params: {
  productId: string;
  // storeId: string;
  token: string;
}) => {
  const response = await api.delete(
    `${baseURL}/${params.productId}`,
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    }
  );

  return response.data;
};

export const clearUserWishList = async (token:string) => {
  const response = await api.delete(`${baseURL}/clear`, {
    headers: {
      Authorization: `Bearer ${token!}`,
    },
  });

  return response.data;
};
