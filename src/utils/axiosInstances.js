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

export default axiosInstance;
