import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(null); // Don't show error on initial check
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      setUser(response.data);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      let message = 'Login failed';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      } else if (err.code === 'ERR_NETWORK') {
        message = 'Network error: Could not connect to server. Please check if the backend is running.';
      }
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authAPI.register({ name, email, password });
      setUser(response.data);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      let message = 'Registration failed';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      } else if (err.code === 'ERR_NETWORK') {
        message = 'Network error: Could not connect to server. Please check if the backend is running.';
      }
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

