// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor - tambahkan token ke setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle error global
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired atau invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// API Functions
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me'),
};

export const assessmentAPI = {
    create: (data) => api.post('/assessments', data),
    getAll: () => api.get('/assessments'),
    getById: (id) => api.get(`/assessments/${id}`),
};

export const exerciseAPI = {
    getAll: () => api.get('/exercises'),
    getById: (id) => api.get(`/exercises/${id}`), // <--- added
    // pass userId to fetch progress for a specific user
    getProgress: (userId) => api.get('/exercises/progress', { params: { userId } }),
    updateProgress: (data) => api.post('/exercises/progress', data),
};

export const storyAPI = {
    getAll: (category) => api.get('/stories', { params: { category } }),
    create: (data) => api.post('/stories', data),
    support: (id) => api.post(`/stories/${id}/support`),
    report: (id, reason) => api.post(`/stories/${id}/report`, { reason }),
};