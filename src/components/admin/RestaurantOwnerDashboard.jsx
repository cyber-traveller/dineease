import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

const RestaurantOwnerDashboard = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    if (!user.restaurantId) {
      setError('No restaurant associated with this account');
      setLoading(false);
      return;
    }
  }, [user]);
  const [restaurantStats, setRestaurantStats] = useState({
    totalReservations: 0,
    totalRevenue: 0,
    averageRating: 0,
    pendingReservations: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'restaurant_owner') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }
    fetchRestaurantStats();
    fetchRecentReservations();
  }, [user]);

  const fetchRestaurantStats = async () => {
    try {
      const response = await axios.get('/api/owner/restaurant/stats');
      setRestaurantStats(response.data);
    } catch (error) {
      setError('Error fetching restaurant statistics');
      console.error('Error:', error);
    }
  };

  const fetchRecentReservations = async () => {
    try {
      const response = await axios.get(`/api/owner/reservations/recent`);
      setRecentReservations(response.data);
    } catch (error) {
      setError('Error fetching recent reservations');
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
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Reservations</h3>
          <p className="text-3xl font-bold text-primary">{restaurantStats.totalReservations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-primary">
            ₹{restaurantStats.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Average Rating</h3>
          <p className="text-3xl font-bold text-primary">
            {restaurantStats.rating ? restaurantStats.rating.toFixed(1) : '0.0'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Reservations</h3>
          <p className="text-3xl font-bold text-primary">{restaurantStats.pendingReservations}</p>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reservations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(reservation.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.partySize}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOwnerDashboard;