import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5050/v1", // Replace with your API base URL
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Replace with your API base URL
  timeout: 20000, // Optional: Set a request timeout (in ms)
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // if (typeof window !== "undefined") {
      //   window.location.href = "/auth";
      // }
    }
    return Promise.reject(error);
  }
);

export default api;
