import api from "@/lib/api";

const baseURL = "/auth";

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: "buyer" | "seller";
}

export const loginUser = async (params: ILogin) => {
  const response = await api.post(`${baseURL}/login`, { ...params });
  return response.data;
  // } catch (error) {
  //   throw Error(`Error response ${(error as Error).message}`);
  // }
};

export const registerUser = async (params: IRegister) => {
  const response = await api.post(`${baseURL}/register`, { ...params });
  return response.data;
};

export const logoutUser = async (token: string) => {
  const response = await api.post(`${baseURL}/logout`, { refreshToken: token });
  return response.data;
};
