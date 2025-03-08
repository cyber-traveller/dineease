import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const RestaurantAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    dailyReservations: [],
    monthlyRevenue: [],
    customerDemographics: {},
    peakHours: [],
    topDishes: [],
    revenueByCategory: []
  });

  useEffect(() => {
    if (!user || user.role !== 'restaurant_owner') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/owner/restaurant/analytics');
      setAnalytics(response.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching analytics data');
      console.error('Error:', error);
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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Reservations Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Daily Reservations</h3>
          {analytics.dailyReservations.length > 0 ? (
            <Line
              data={{
                labels: analytics.dailyReservations.map(item => item.date),
                datasets: [{
                  label: 'Reservations',
                  data: analytics.dailyReservations.map(item => item.count),
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 } }
                }
              }}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No reservation data available</p>
          )}
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Revenue</h3>
          {analytics.monthlyRevenue.length > 0 ? (
            <Bar
              data={{
                labels: analytics.monthlyRevenue.map(item => item.month),
                datasets: [{
                  label: 'Revenue (₹)',
                  data: analytics.monthlyRevenue.map(item => item.amount),
                  backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  borderRadius: 4
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  tooltip: { mode: 'index', intersect: false }
                }
              }}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No revenue data available</p>
          )}
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Peak Hours</h3>
          {analytics.peakHours.length > 0 ? (
            <Bar
              data={{
                labels: analytics.peakHours.map(item => item.hour),
                datasets: [{
                  label: 'Reservations',
                  data: analytics.peakHours.map(item => item.count),
                  backgroundColor: 'rgba(99, 102, 241, 0.8)',
                  borderRadius: 4
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 } }
                }
              }}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No peak hours data available</p>
          )}
        </div>

        {/* Revenue by Category Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue by Category</h3>
          {analytics.revenueByCategory.length > 0 ? (
            <Doughnut
              data={{
                labels: analytics.revenueByCategory.map(item => item.category),
                datasets: [{
                  data: analytics.revenueByCategory.map(item => item.amount),
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                  ]
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'right' }
                }
              }}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No category data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantAnalytics;