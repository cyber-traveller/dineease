import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const OwnerDashboard = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [restaurantRes, statsRes] = await Promise.all([
          axios.get('/api/owner/restaurant', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/owner/restaurant/stats', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!restaurantRes.data || !statsRes.data) {
          throw new Error('Invalid response from server');
        }

        setRestaurantData(restaurantRes.data);
        setStats({
          totalReservations: statsRes.data.totalReservations || 0,
          pendingReservations: statsRes.data.pendingReservations || 0,
          totalRevenue: statsRes.data.totalRevenue || 0,
          rating: statsRes.data.averageRating || 0,
          reviewCount: statsRes.data.totalReviews || 0
        });
        setError(null);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        setRestaurantData(null);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setError('Authentication required');
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {restaurantData?.name} Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Reservations"
          value={stats?.totalReservations || 0}
          icon="📅"
        />
        <StatCard
          title="Pending Reservations"
          value={stats?.pendingReservations || 0}
          icon="⏳"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
          icon="💰"
        />
        <StatCard
          title="Average Rating"
          value={`${stats?.rating || 0} (${stats?.reviewCount || 0} reviews)`}
          icon="⭐"
        />
      </div>

      {/* Restaurant Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Restaurant Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Address</p>
            <p>{restaurantData?.address?.street}</p>
            <p>{`${restaurantData?.address?.city}, ${restaurantData?.address?.state} ${restaurantData?.address?.zipCode}`}</p>
          </div>
          <div>
            <p className="text-gray-600">Contact</p>
            <p>Phone: {restaurantData?.phone}</p>
            <p>Email: {restaurantData?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default OwnerDashboard;