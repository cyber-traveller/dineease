import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeRestaurants: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      setError('Error fetching statistics');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Total Reservations</h3>
        <p className="text-3xl font-bold text-primary">{stats.totalReservations}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-primary">
          ₹{stats.totalRevenue.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Average Rating</h3>
        <p className="text-3xl font-bold text-primary">
          {stats.averageRating.toFixed(1)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Active Restaurants</h3>
        <p className="text-3xl font-bold text-primary">{stats.activeRestaurants}</p>
      </div>
    </div>
  );
};

export default DashboardStats;