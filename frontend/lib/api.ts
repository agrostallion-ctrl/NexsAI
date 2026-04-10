import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {  // ← yeh add karo
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;