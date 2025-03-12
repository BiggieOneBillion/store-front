import api from "@/lib/api";
const baseURL = "/paystack";

export async function verifyPayment(reference: string) {
  const res = await api.get(`${baseURL}/verify?reference=${reference}`);
  return res.data;
}

export async function initiatePayment(orderId: string, token: string) {
  const res = await api.post(
    `${baseURL}/initialize/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}
