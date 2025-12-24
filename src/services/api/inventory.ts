import api from "@/lib/api";

export type CreateStockData = {
  product: string;
  type: "restock" | "refund" | "adjustment" | "return";
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  referenceType: "manual" | "return" | "adjustment";
  referenceId: string | null;
  notes?: string;
  performedBy: string;
};

const baseURL = "/stock-history";

export const createStock = async (params: {
  data: CreateStockData;
  token: string;
}) => {
  const response = await api.post(
    `${baseURL}`,
    { ...params.data },
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getStockHistory = async (token: string) => {
  const response = await api.get(`${baseURL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getStockHistoryByProduct = async (params: {
  productId: string;
  token: string;
}) => {
  const response = await api.get(`${baseURL}/product/${params.productId}`, {
    headers: {
      Authorization: `Bearer ${params.token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
