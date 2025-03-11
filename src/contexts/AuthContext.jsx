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
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get('/auth/profile');
      const userData = response.data;

      // If user is a restaurant owner, fetch their restaurant details
      if (userData.role === 'restaurant_owner') {
        try {
          const restaurantResponse = await axiosInstance.get('/owner/restaurant');
          userData.restaurantId = restaurantResponse.data._id;
          userData.restaurant = restaurantResponse.data;
        } catch (error) {
          console.error('Failed to fetch restaurant details:', error);
          if (error.response?.status === 404) {
            userData.shouldCreateRestaurant = true;
          } else {
            // Handle other errors (500, network issues, etc.)
            console.error('Restaurant fetch error:', error.response?.data || error.message);
          }
        }
      }

      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error.response?.data || error.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);

        // If user is a restaurant owner, fetch their restaurant details
        if (response.data.user.role === 'restaurant_owner') {
          try {
            const restaurantResponse = await axiosInstance.get('/owner/restaurant');
            const updatedUser = {
              ...response.data.user,
              restaurantId: restaurantResponse.data._id,
              restaurant: restaurantResponse.data
            };
            setUser(updatedUser);
          } catch (error) {
            console.error('Error fetching restaurant:', error);
          }
        }

        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
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