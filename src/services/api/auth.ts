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

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  token: string;
  password: string;
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

export const logoutUser = async (params: {
  refreshToken: string;
  userId: string;
}) => {
  const response = await api.post(`${baseURL}/logout`, {
    refresh: params.refreshToken,
    userId: params.userId,
  });
  return response.data;
};

export const forgotPassword = async (param: { email: string }) => {
  const response = await api.post(`${baseURL}/forgot-password`, {
    email: param.email,
  });
  return response.data;
};

export const resetPassword = async (param: {
  token: string;
  password: string;
}) => {
  const response = await api.post(
    `${baseURL}/reset-password?token=${param.token}`,
    {
      password: param.password,
    }
  );
  return response.data;
};

export const onlineStatus = async (params: { token: string }) => {
  const response = await api.get(`${baseURL}/status`, {
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  });
  return response.data;
};

export const refreshAuthToken = async (params: { refreshToken: string }) => {
  const response = await api.post(`${baseURL}/refresh-tokens`, {
    refreshToken: params.refreshToken,
  });
  return response.data;
};
