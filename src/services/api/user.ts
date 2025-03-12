import api from "@/lib/api";
import { useUserStore } from "@/store/user-store";

const baseURL = "/users";

const user = useUserStore.getState().user;

interface IUserAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface IUser {
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  address: IUserAddress;
}

export const getUser = async (id: string, token: string) => {
  const response = await api.get(`${baseURL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateUserDetails = async (params: {
  userId: string;
  data: Partial<IUser>;
  token: string;
}) => {
  const response = await api.patch(`${baseURL}/${params.userId}`, params.data, {
    headers: {
      Authorization: `Bearer ${params.token!}`,
    },
  });

  return response.data;
};

export const deleteUserDetails = async (params: {
  userId: string;
  data: any;
}) => {
  const response = await api.delete(`${baseURL}/${params.userId}`, {
    headers: {
      Authorization: `Bearer ${user?.token!}`,
    },
  });

  return response.data;
};
