import {
  ILogin,
  IRegister,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";

export function useAuth() {
  const {
    mutateAsync: register,
    isPending: isRegistering,
    error: registerError,
  } = useMutation({
    mutationFn: async (param: IRegister) => registerUser(param),
  });

  const {
    mutateAsync: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation({
    mutationFn: async (param: ILogin) => loginUser(param),
  });

  const {
    mutateAsync: logOut,
    isPending: isLoggingOut,
    error: logoutError,
  } = useMutation({
    mutationFn: async (refreshToken: string) => logoutUser(refreshToken),
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
  };
}
