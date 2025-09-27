import axios from "axios";
import { toast } from "react-toastify";

const API_HOST = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_HOST}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('authToken');
        toast.warn("Sua sessão expirou. Por favor, faça login novamente.");
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    }
    return Promise.reject(error);
  }
);

export default api;