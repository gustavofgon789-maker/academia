import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@gel:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isAdminPath = window.location.pathname.startsWith('/admin');
      if (isAdminPath && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('@gel:token');
        localStorage.removeItem('@gel:user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  },
);

export function imageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path}`;
}
