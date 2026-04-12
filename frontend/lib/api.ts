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


// ✅ Token expire hone pe logout karo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api;