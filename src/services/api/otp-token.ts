import api from "@/lib/api";
const baseURL = "/otp-token";

export const verifyOtpToken = async (params: {
  userId: string;
  otp: string;
  token: string;
}) => {
  const response = await api.post(
    `${baseURL}/verify-otp-token/${params.userId}`,
    { token: params.otp },
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
