import api from "@/lib/api";

const baseURL = "/store";

export interface IStore {
  name: string;
  description: string;
  logo: string | File;
  bannerImage: string;
  categories: string[];
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export const getUserStore = async (userId: string, token: string) => {
  const response = await api.get(`${baseURL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const createUserStore = async (params: {
  token: string;
  data: IStore;
  userId: string;
}) => {
  const response = await api.post(
    `${baseURL}/${params.userId}`,
    { ...params.data },
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const updateUserStore = async (params: {
  token: string;
  data: Partial<IStore>;
  userId: string;
}) => {
  const response = await api.patch(
    `${baseURL}/${params.userId}`,
    { ...params.data },
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
