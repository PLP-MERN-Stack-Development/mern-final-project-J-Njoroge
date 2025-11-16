import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

// Carbon API
export const carbonAPI = {
  getEntries: () => api.get('/carbon'),
  createEntry: (data) => api.post('/carbon', data),
  getStats: () => api.get('/carbon/stats'),
  deleteEntry: (id) => api.delete(`/carbon/${id}`)
};

// Pledge API
export const pledgeAPI = {
  getPledges: () => api.get('/pledge'),
  createPledge: (data) => api.post('/pledge', data),
  toggleLike: (id) => api.post(`/pledge/${id}/like`),
  getGlobalCO2: () => api.get('/pledge/global-co2')
};

export default api;

