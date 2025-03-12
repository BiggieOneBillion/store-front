import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/v1", // Replace with your API base URL
  timeout: 10000, // Optional: Set a request timeout (in ms)
});

export default api;
