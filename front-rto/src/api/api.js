import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Use VITE_API_URL from .env or fallback to localhost
});

export default api;