import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5000", // Use your backend API URL
});

// Add a request interceptor to inject JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const app_access_token = Cookies.get("app_access_token");

    if (app_access_token) {
      config.headers["Authorization"] = `Bearer ${app_access_token}`;
    } else {
      window.location.replace("/");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
