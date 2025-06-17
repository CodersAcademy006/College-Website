import axios from 'axios';
import { toast } from 'react-hot-toast';
import * as Sentry from '@sentry/react';

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const tokens = localStorage.getItem('auth_tokens');
    if (tokens) {
      const { accessToken } = JSON.parse(tokens);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const tokens = localStorage.getItem('auth_tokens');
        if (!tokens) {
          throw new Error('No refresh token available');
        }

        const { refreshToken } = JSON.parse(tokens);

        // Call refresh token endpoint
        const response = await apiClient.post('/auth/refresh', {
          refreshToken,
        });

        const { tokens: newTokens } = response.data;

        // Update localStorage
        localStorage.setItem('auth_tokens', JSON.stringify(newTokens));

        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || 'An error occurred';
    toast.error(errorMessage);

    // Log to Sentry for 5xx errors
    if (error.response?.status >= 500) {
      Sentry.captureException(error);
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  students: {
    list: '/students',
    detail: (id: string) => `/students/${id}`,
    create: '/students',
    update: (id: string) => `/students/${id}`,
    delete: (id: string) => `/students/${id}`,
  },
  courses: {
    list: '/courses',
    detail: (id: string) => `/courses/${id}`,
    create: '/courses',
    update: (id: string) => `/courses/${id}`,
    delete: (id: string) => `/courses/${id}`,
  },
  teachers: {
    list: '/teachers',
    detail: (id: string) => `/teachers/${id}`,
    create: '/teachers',
    update: (id: string) => `/teachers/${id}`,
    delete: (id: string) => `/teachers/${id}`,
  },
  attendance: {
    list: '/attendance',
    detail: (id: string) => `/attendance/${id}`,
    create: '/attendance',
    update: (id: string) => `/attendance/${id}`,
    delete: (id: string) => `/attendance/${id}`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    attendance: '/analytics/attendance',
    enrollment: '/analytics/enrollment',
    workload: '/analytics/workload',
  },
};

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  logout: () => {
    useAuthStore.getState().logout();
  },
};

export const studentService = {
  getAll: async () => {
    const response = await apiClient.get('/students');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/students', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/students/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/students/${id}`);
    return response.data;
  },
};

export const courseService = {
  getAll: async () => {
    const response = await apiClient.get('/courses');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/courses', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  },
};

export const attendanceService = {
  getByDate: async (date: string) => {
    const response = await apiClient.get(`/attendance?date=${date}`);
    return response.data;
  },
  markAttendance: async (data: any) => {
    const response = await apiClient.post('/attendance', data);
    return response.data;
  },
  updateAttendance: async (id: string, data: any) => {
    const response = await apiClient.put(`/attendance/${id}`, data);
    return response.data;
  },
};

export default apiClient; 