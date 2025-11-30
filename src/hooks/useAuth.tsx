import {
  ILogin,
  IRegister,
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  IForgotPassword,
  IResetPassword,
  resetPassword,
  refreshAuthToken,
} from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useAuth() {
  const {
    mutateAsync: refreshToken,
    isPending: isrefreshToken,
    error: refreshTokenError,
  } = useMutation({
    mutationFn: async (param: { refreshToken: string }) =>
      refreshAuthToken(param),
  });

  const {
    mutateAsync: register,
    isPending: isRegistering,
    error: registerError,
  } = useMutation({
    mutationFn: async (param: IRegister) => registerUser(param),
  });

  const {
    mutateAsync: registerToBackend,
    isPending: isRegisteringToBackend,
    error: registerToBackendError,
  } = useMutation({
    mutationFn: async (param: IRegister) =>
      await axios.post("/api/register", param),
  });

  const {
    mutateAsync: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation({
    mutationFn: async (param: ILogin) => loginUser(param),
  });

  const {
    mutateAsync: loginToBackend,
    isPending: isLoggingInBackend,
    error: loginErrorBackend,
  } = useMutation({
    mutationFn: async (param: ILogin) => await axios.post("api/login", param),
  });

  const {
    mutateAsync: logOut,
    isPending: isLoggingOut,
    error: logoutError,
  } = useMutation({
    mutationFn: async (params: { refreshToken: string; userId: string }) =>
      logoutUser(params),
  });

  const {
    mutateAsync: forgotPasswordFn,
    isPending: isforgotPassword,
    error: forgotPasswordError,
  } = useMutation({
    mutationFn: async (param: IForgotPassword) => forgotPassword(param),
  });

  const {
    mutateAsync: resetPasswordFn,
    isPending: isResettingPassword,
    error: resetPasswordError,
  } = useMutation({
    mutationFn: async (param: IResetPassword) => resetPassword(param),
  });

  return {
    // register user
    register,
    isRegistering,
    registerError,
    // login user
    login,
    isLoggingIn,
    loginError,
    // logout user
    logOut,
    isLoggingOut,
    logoutError,
    // login using the api backend on next. This is just for us to have a cokkie returned to us.
    loginToBackend,
    isLoggingInBackend,
    loginErrorBackend,
    // registeration using the api route.
    registerToBackend,
    isRegisteringToBackend,
    registerToBackendError,
    // forgot password
    forgotPasswordFn,
    isforgotPassword,
    forgotPasswordError,
    // resetting password
    resetPasswordFn,
    isResettingPassword,
    resetPasswordError,
    // refresh tokens
    refreshToken,
    isrefreshToken,
    refreshTokenError,
  };
}
