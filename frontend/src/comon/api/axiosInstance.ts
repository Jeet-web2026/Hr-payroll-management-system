import axios from "axios";
import { TokenService } from "./tokenService";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const res = await axiosInstance.post("/auth/refresh");
        TokenService.set(res.data.data.accessToken);

        error.config.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
        return axiosInstance(error.config);
      } catch {
        TokenService.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
