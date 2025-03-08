import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axios';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  register: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axiosInstance.get('/auth/me');
        const userData = response.data;

        // If user is a restaurant owner, fetch their restaurant details
        if (userData.role === 'restaurant_owner') {
          try {
            const restaurantResponse = await axiosInstance.get('/owner/restaurant');
            userData.restaurantId = restaurantResponse.data._id;
            userData.restaurant = restaurantResponse.data;
          } catch (error) {
            console.error('Failed to fetch restaurant details:', error);
          }
        }

        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);

      // If user is a restaurant owner, fetch their restaurant details
      if (userData.role === 'restaurant_owner') {
        try {
          const restaurantResponse = await axiosInstance.get('/owner/restaurant');
          if (restaurantResponse.data.status === 'no_restaurant') {
            userData.shouldCreateRestaurant = true;
          } else {
            userData.restaurantId = restaurantResponse.data._id;
            userData.shouldCreateRestaurant = false;
          }
        } catch (error) {
          console.error('Failed to fetch restaurant details:', error);
          userData.shouldCreateRestaurant = true;
        }
      }

      setUser({
        ...userData,
        role: userData.role || 'user'
      });
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const { token, user: newUser } = response.data;
      localStorage.setItem('token', token);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};