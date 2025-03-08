import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurantStats = async () => {
    try {
      const { data } = await axiosInstance.get('/owner/restaurant/stats');
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching restaurant stats:', error);
      setError('Failed to fetch restaurant statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'restaurant_owner') {
      fetchRestaurantStats();
    }
  }, [user]);

  if (!user || user.role !== 'restaurant_owner') {
    return <div>Access denied. Only restaurant owners can view this page.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Reservations</h2>
            <p className="text-3xl">{stats.totalReservations}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
            <p className="text-3xl">₹{stats.totalRevenue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Rating</h2>
            <p className="text-3xl">{stats.rating.toFixed(1)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Review Count</h2>
            <p className="text-3xl">{stats.reviewCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;