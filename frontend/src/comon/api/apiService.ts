import axiosInstance from "./axiosInstance";

const apiService = {
  get: (url: string, params = {}, config = {}) => {
    return axiosInstance.get(url, { params, ...config });
  },

  post: (url: string, data = {}, config = {}) => {
    return axiosInstance.post(url, data, config);
  },

  put: (url: string, data = {}, config = {}) => {
    return axiosInstance.put(url, data, config);
  },

  patch: (url: string, data = {}, config = {}) => {
    return axiosInstance.patch(url, data, config);
  },

  delete: (url: string, config = {}) => {
    return axiosInstance.delete(url, config);
  },
};

export default apiService;
