import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("mf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout if backend returns 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("mf_token");
      localStorage.removeItem("mf_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
