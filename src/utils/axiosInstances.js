import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_Backend_Port, 
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized! Redirecting...");
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;
