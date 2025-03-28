import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000,
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('adminToken');
            window.location.href = '/admin-page/login';
        }
        return Promise.reject(error);
    }
);

export default instance; 