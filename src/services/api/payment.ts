import api from "@/lib/api";

const baseURL = "/payment";

export const getAllPayment = async (token: string) => {
  const response = await api.get(`${baseURL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
