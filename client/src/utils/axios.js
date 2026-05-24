import axios from "axios";

const api = axios.create({
  baseURL: "https://eventify-backend-6j7q.onrender.com/api",
});

// ✅ ADD THIS (TOKEN FIX)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;