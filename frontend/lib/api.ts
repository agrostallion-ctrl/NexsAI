import axios from "axios";

const api = axios.create({
  baseURL:"https://nexsai.onrender.com"
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {  // ← ye h add karo
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;