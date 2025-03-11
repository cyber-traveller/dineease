import React from 'react';
import { FaUsers, FaStar, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const RestaurantStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalReservations || 0,
      icon: <FaUsers className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
      icon: <FaMoneyBillWave className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating?.toFixed(1) || '0.0',
      icon: <FaStar className="text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews || 0,
      icon: <FaChartLine className="text-purple-500" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantStats;