import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const api = axios.create({
    baseURL: '/api'
});

api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
