import axios from "axios";

// Create an instance of Axios with default settings
const apiClient = axios.create({
  baseURL: "https://localhost:7124", // Replace with your base API URL
});

// Add an interceptor to include the token in every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Store the token securely
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
