import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import RestaurantReservations from './RestaurantReservations';
import RestaurantReviews from './RestaurantReviews';
import RestaurantManagement from './RestaurantManagement';
import RestaurantAnalytics from '../../components/owner/RestaurantAnalytics';
import RestaurantStats from '../../components/owner/RestaurantStats';

const Dashboard = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'restaurant_owner') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }
    fetchInitialData();
    const interval = setInterval(fetchRestaurantStats, 60000); // Update stats every minute
    return () => clearInterval(interval);
  }, [user]);

  const fetchInitialData = async () => {
    try {
      const [statsResponse, restaurantResponse] = await Promise.all([
        axios.get('/owner/restaurant/stats'),
        axios.get('/owner/restaurant')
      ]);
      setStats(statsResponse.data);
      setRestaurant(restaurantResponse.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching restaurant data');
      console.error('Error fetching restaurant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantStats = async () => {
    try {
      const response = await axios.get('/owner/restaurant/stats');
      setStats(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching restaurant stats:', error);
    }
  };

  if (!user || user.role !== 'restaurant_owner') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">Unauthorized access</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {restaurant?.name || 'Restaurant Dashboard'}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          restaurant?.status === 'active' ? 'bg-green-100 text-green-800' :
          restaurant?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {restaurant?.status?.charAt(0).toUpperCase() + restaurant?.status?.slice(1)}
        </span>
      </div>

      {stats && <RestaurantStats stats={stats} />}

      <nav className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow-lg">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="reservations"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`
          }
        >
          Reservations
        </NavLink>
        <NavLink
          to="reviews"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`
          }
        >
          Reviews
        </NavLink>
        <NavLink
          to="analytics"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`
          }
        >
          Analytics
        </NavLink>
        <NavLink
          to="management"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`
          }
        >
          Management
        </NavLink>
      </nav>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <Routes>
          <Route index element={<RestaurantStats stats={stats} />} />
          <Route path="reservations" element={<RestaurantReservations />} />
          <Route path="reviews" element={<RestaurantReviews />} />
          <Route path="analytics" element={<RestaurantAnalytics />} />
          <Route path="management" element={<RestaurantManagement restaurant={restaurant} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;