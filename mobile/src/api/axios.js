import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
    baseURL: 'http://10.183.120.33:5000', // Your Wi-Fi IP — works with Expo Go on phone
    timeout: 10000,
});

API.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
            }
        }
        return Promise.reject(error);
    }
);

export default API;
