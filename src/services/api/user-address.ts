import api from "@/lib/api";
import { useUserStore } from "@/store/user-store";

const baseURL = "/user-address";

export interface IUserAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export const getUserAddress = async (params: {
  userId: string;
  token: string;
}) => {
  const response = await api.get(`${baseURL}/${params.userId}`, {
    headers: {
      Authorization: `Bearer ${params.token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const addUserAddress = async (params: {
  userId: string;
  data: IUserAddress;
  token: string;
}) => {
  const response = await api.post(`${baseURL}/${params.userId}`, params.data, {
    headers: { Authorization: `Bearer ${params.token!}` },
  });

  return response.data;
};

export const updateUserAddress = async (params: {
  userId: string;
  data: Partial<IUserAddress>;
  token: string;
  addressId: string;
}) => {
  const response = await api.patch(
    `${baseURL}/${params.userId}/${params.addressId}`,
    params.data,
    {
      headers: {
        Authorization: `Bearer ${params.token!}`,
      },
    }
  );

  return response.data;
};

export const deleteUserAddress = async (params: {
  userId: string;
  addressId: string;
}) => {
  const response = await api.delete(
    `${baseURL}/${params.userId}/${params.addressId}`,
    {
      headers: {
        Authorization: `Bearer ${useUserStore.getState().user?.token!}`,
      },
    }
  );

  return response.data;
};
