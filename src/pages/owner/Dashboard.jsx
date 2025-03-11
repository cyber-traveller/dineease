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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchInitialData();
    const interval = setInterval(fetchInitialData, 60000); // Update data every minute
    return () => clearInterval(interval);
  }, [user]);

  const [data, setData] = useState({
    restaurantStats: null,
    restaurantData: null
  });

  const fetchInitialData = async () => {
    try {
      const [statsResponse, restaurantResponse] = await Promise.all([
        axios.get('/api/owner/restaurant/stats'),
        axios.get('/api/owner/restaurant')
      ]);

      setData({
        restaurantStats: statsResponse.data,
        restaurantData: restaurantResponse.data
      });
      setError('');
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      if (error.response?.status === 404) {
        setError('Please create your restaurant profile first');
      } else {
        setError('Failed to fetch restaurant data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Please log in to access the dashboard</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {data.restaurantData?.name || 'Restaurant Dashboard'}
        </h1>
        {data.restaurantData?.status && (
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            data.restaurantData.status === 'active' ? 'bg-green-100 text-green-800' :
            data.restaurantData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {data.restaurantData.status.charAt(0).toUpperCase() + data.restaurantData.status.slice(1)}
          </span>
        )}
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
          <Route index element={<div className="space-y-8">
            <RestaurantStats stats={data.restaurantStats} />
            <RestaurantAnalytics />
          </div>} />
          <Route path="reservations" element={<RestaurantReservations />} />
          <Route path="reviews" element={<RestaurantReviews />} />
          <Route path="analytics" element={<RestaurantAnalytics />} />
          <Route path="management" element={<RestaurantManagement restaurant={data.restaurantData} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;