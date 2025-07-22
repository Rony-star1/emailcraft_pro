import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const apiClient = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    me: (token) => api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
  },

  // Payment endpoints
  payments: {
    getPlans: () => api.get('/payments/plans'),
    createIntent: (data) => api.post('/payments/create-intent', data),
    confirmPayment: (paymentIntentId, data) => api.post(`/payments/confirm/${paymentIntentId}`, data),
    getSubscription: () => api.get('/payments/subscription'),
    cancelSubscription: () => api.post('/payments/cancel-subscription'),
    getPaymentHistory: () => api.get('/payments/history'),
  },

  // Campaign endpoints
  campaigns: {
    getAll: (params) => api.get('/campaigns', { params }),
    getById: (id) => api.get(`/campaigns/${id}`),
    create: (data) => api.post('/campaigns', data),
    update: (id, data) => api.put(`/campaigns/${id}`, data),
    delete: (id) => api.delete(`/campaigns/${id}`),
    send: (id) => api.post(`/campaigns/${id}/send`),
    duplicate: (id) => api.post(`/campaigns/${id}/duplicate`),
    getAnalytics: (id) => api.get(`/campaigns/${id}/analytics`),
  },

  // Contact endpoints
  contacts: {
    getAll: (params) => api.get('/contacts', { params }),
    getById: (id) => api.get(`/contacts/${id}`),
    create: (data) => api.post('/contacts', data),
    update: (id, data) => api.put(`/contacts/${id}`, data),
    delete: (id) => api.delete(`/contacts/${id}`),
    bulkImport: (data) => api.post('/contacts/bulk-import', data),
    bulkDelete: (ids) => api.post('/contacts/bulk-delete', { ids }),
    export: (params) => api.get('/contacts/export', { params }),
  },

  // Analytics endpoints
  analytics: {
    getDashboard: () => api.get('/analytics/dashboard'),
    getCampaignMetrics: (campaignId) => api.get(`/analytics/campaigns/${campaignId}`),
    getEmailMetrics: (params) => api.get('/analytics/emails', { params }),
    getEngagementMetrics: (params) => api.get('/analytics/engagement', { params }),
    getRevenueMetrics: (params) => api.get('/analytics/revenue', { params }),
  },

  // AI endpoints
  ai: {
    generateSubjectLines: (data) => api.post('/ai/generate-subject-lines', data),
    generateContent: (data) => api.post('/ai/generate-content', data),
    optimizeContent: (data) => api.post('/ai/optimize-content', data),
    analyzeSentiment: (data) => api.post('/ai/analyze-sentiment', data),
    generateABVariations: (data) => api.post('/ai/generate-ab-variations', data),
  },

  // User endpoints
  users: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.post('/users/change-password', data),
    deleteAccount: () => api.delete('/users/account'),
    updatePreferences: (data) => api.put('/users/preferences', data),
  },
};

// Error handling helper
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { error: 'Bad Request', message: data.error || 'Invalid request parameters' };
      case 401:
        return { error: 'Unauthorized', message: 'Please log in to continue' };
      case 403:
        return { error: 'Forbidden', message: 'You do not have permission to perform this action' };
      case 404:
        return { error: 'Not Found', message: 'The requested resource was not found' };
      case 429:
        return { error: 'Too Many Requests', message: 'Please try again later' };
      case 500:
        return { error: 'Server Error', message: 'Something went wrong on our end' };
      default:
        return { error: 'Unknown Error', message: data.error || 'An unexpected error occurred' };
    }
  } else if (error.request) {
    // Network error
    return { error: 'Network Error', message: 'Please check your internet connection' };
  } else {
    // Something else happened
    return { error: 'Error', message: error.message || 'An unexpected error occurred' };
  }
};

// Helper functions for common operations
export const apiHelpers = {
  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },

  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Format API response
  formatResponse: (response) => {
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  },

  // Create FormData for file uploads
  createFormData: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  },
};

export default api;