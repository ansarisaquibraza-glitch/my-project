// frontend/src/services/api.js
// Centralized Axios-like fetch wrapper for all API calls

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core request helper — attaches auth token and handles errors uniformly.
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
};

// ── Auth ───────────────────────────────────────────────────────
export const authAPI = {
  signup: (body) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getMe: () => request('/auth/me'),
};

// ── Reports ────────────────────────────────────────────────────
export const reportsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
    ).toString();
    return request(`/reports${query ? `?${query}` : ''}`);
  },

  getById: (id) => request(`/reports/${id}`),

  create: (body) =>
    request('/reports', { method: 'POST', body: JSON.stringify(body) }),

  update: (id, body) =>
    request(`/reports/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (id) => request(`/reports/${id}`, { method: 'DELETE' }),

  getStats: () => request('/reports/stats/summary'),

  export: () => request('/reports/export'),
};
