import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient } from '../utils/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user data
      apiClient.auth.me(token)
        .then(response => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.user, token },
          });
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          dispatch({ type: 'SET_LOADING', payload: false });
        });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await apiClient.auth.login({ email, password });
      localStorage.setItem('authToken', response.token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
      return response;
    } catch (error) {
      console.error('Login error details:', error);
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await apiClient.auth.register({ name, email, password });
      localStorage.setItem('authToken', response.token);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
      return response;
    } catch (error) {
      console.error('Registration error details:', error);
      let errorMessage = 'Registration failed';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'REGISTER_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};