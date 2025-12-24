import { verifyOtpToken } from "@/services/api/otp-token";
import { useMutation } from "@tanstack/react-query";

export const useOtpToken = () => {
  const {
    mutateAsync: verifyOtpTokenFn,
    isPending: isVerifyingOtpToken,
    error: verifyOtpTokenError,
  } = useMutation({
    mutationFn: async (params: {
      userId: string;
      otp: string;
      token: string;
    }) => verifyOtpToken(params),
  });


  return {
    verifyOtpTokenFn,
    isVerifyingOtpToken,
    verifyOtpTokenError,
  };
};
