import axios from "axios";

const API_HOST = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_HOST}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
