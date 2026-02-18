import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only force-redirect to login on 401 if the user had a token
        // (i.e., their session expired). Don't redirect if they were never logged in.
        if (error.response?.status === 401) {
            const token = localStorage.getItem('token');
            if (token) {
                // Token exists but was rejected — session expired, force logout
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
            // If no token, just let the error propagate normally (user not logged in)
        }
        return Promise.reject(error);
    }
);

export default API;
