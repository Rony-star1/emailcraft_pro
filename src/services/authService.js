import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'emailcraft_auth_token';
const USER_KEY = 'emailcraft_user';

export const tokenManager = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    // Set default authorization header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  },
  
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  }
};

// Initialize token on service load
const token = tokenManager.getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenManager.removeToken();
      tokenManager.removeUser();
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication service
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;
      
      // Store token and user data
      tokenManager.setToken(token);
      tokenManager.setUser(user);
      
      return {
        success: true,
        user,
        token,
        message: response.data.message
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
        message: error.response?.data?.message || 'An unexpected error occurred'
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      // Store token and user data
      tokenManager.setToken(token);
      tokenManager.setUser(user);
      
      return {
        success: true,
        user,
        token,
        message: response.data.message
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
        message: error.response?.data?.message || 'An unexpected error occurred'
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
      
      // Clear stored data
      tokenManager.removeToken();
      tokenManager.removeUser();
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Clear stored data even if API call fails
      tokenManager.removeToken();
      tokenManager.removeUser();
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      const { user } = response.data;
      
      // Update stored user data
      tokenManager.setUser(user);
      
      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get user data',
        message: error.response?.data?.message || 'An unexpected error occurred'
      };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return {
        success: true,
        valid: response.data.valid,
        user: response.data.user
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        valid: false,
        error: error.response?.data?.error || 'Token verification failed'
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenManager.getToken();
    const user = tokenManager.getUser();
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: () => {
    return tokenManager.getUser();
  },

  // Get stored token
  getStoredToken: () => {
    return tokenManager.getToken();
  }
};

export default authService;

