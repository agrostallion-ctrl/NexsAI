import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "https://nexsai.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 🔥 MUST
  }

  return config;
});

export default api;