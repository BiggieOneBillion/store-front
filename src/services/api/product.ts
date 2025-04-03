import { Product } from "@/app/account/dashboard/product-management/_component/columns";
import api from "@/lib/api";

const baseURL = "/product";

export interface IProduct {
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  images: File[]; // Assuming imageFiles is an array of File objects
  inventory: {
    quantity: number;
    sku: string;
    lowStockThreshold?: number;
  };
  variants: {
    name: string;
    options?: string[];
    price: number;
    quantity: number;
    sku: string;
  }[];
  specifications?: {
    name: string;
    value: string;
  }[];
}

export const getProductDetails = async (id: string, token: string) => {
  const response = await api.get(`${baseURL}/detail/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getRelatedProduct = async (params: {
  productId: string;
  token: string;
  categoryId: string;
}) => {
  const response = await api.get(
    `${baseURL}/related/${params.productId}/${params.categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getStoreProducts = async (userId: string, token: string) => {
  const response = await api.get(`${baseURL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getStoreProduct = async (userId: string, token: string) => {
  const response = await api.get(`${baseURL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const createProduct = async (params: {
  token: string;
  data: IProduct;
  userId: string;
}) => {
  const response = await api.post(
    `${baseURL}/${params.userId}`,
    { ...params.data },
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const updateProduct = async (params: {
  token: string;
  data: Partial<IProduct>;
  userId: string;
  productId: string;
}) => {
  const response = await api.patch(
    `${baseURL}/${params.userId}/${params.productId}`,
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
