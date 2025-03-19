import api from "@/lib/api";
import { Order } from "@/types/orders";

const baseURL = "/discount";

export type Discount = {
  code?: string;
  type: "percentage" | "fixed";
  value: number;
  startDate: Date;
  endDate: Date;
  minimumPurchase?: number;
  maximumDiscount?: number;
  usageLimit: {
    perCustomer: number;
    total: number;
  };
  applicableTo: "all" | "category" | "product" | "variant";
  conditions: {
    categories?: string[];
    products?: string[];
    excludedProducts?: string[];
  };
  active: boolean;
};

export const createDiscount = async (params: {
  token: string;
  data: Discount;
}) => {
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

export const getDiscount = async (params: { token: string }) => {
  const response = await api.get(
    `${baseURL}`,
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    }
  );
  return response.data;
};
