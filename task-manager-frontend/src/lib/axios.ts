import axios from "axios";

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth headers
apiClient.interceptors.request.use((config) => {
  return config;
});

// Response interceptor to handle auth errors
apiClient.interceptors.response.use((response) => {
  return response;
});

export default apiClient;
