import { CategoryFormValues } from "@/app/account/dashboard/category-management/page";
import api from "@/lib/api";

const baseURL = "/categories";

export const createCategory = async (params: {
  token: string;
  data: CategoryFormValues;
}) => {
  const response = await api.post(
    `${baseURL}`,
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

export const getCategories = async (params: { token: string }) => {
  const response = await api.get(`${baseURL}`, {
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  });
  return response.data;
};

export const getCategory = async () => {
  const response = await api.get(`${baseURL}`);
  return response.data;
};
