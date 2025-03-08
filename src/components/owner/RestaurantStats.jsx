import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const RestaurantStats = ({ stats }) => {
  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Reservations</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.totalReservations || 0}</p>
        <p className="text-sm text-gray-500 mt-1">All-time bookings</p>
        {stats.reservationChange && (
          <div className={`text-sm mt-2 ${stats.reservationChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.reservationChange > 0 ? '+' : ''}{stats.reservationChange}% from last month
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Rating</h3>
        <div className="flex items-center">
          <p className="text-3xl font-bold text-blue-600 mr-2">{stats.averageRating?.toFixed(1) || 0}</p>
          <span className="text-yellow-400 text-2xl">★</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">From {stats.totalReviews || 0} reviews</p>
        {stats.ratingChange && (
          <div className={`text-sm mt-2 ${stats.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.ratingChange > 0 ? '+' : ''}{stats.ratingChange.toFixed(1)} from last month
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-blue-600">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
        <p className="text-sm text-gray-500 mt-1">Lifetime earnings</p>
        {stats.revenueChange && (
          <div className={`text-sm mt-2 ${stats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange}% from last month
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Tables</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.activeTables || 0}</p>
        <p className="text-sm text-gray-500 mt-1">Currently occupied</p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(stats.activeTables / stats.totalTables * 100) || 0}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{stats.activeTables || 0}/{stats.totalTables || 0} tables</p>
      </div>
    </div>
  );
};

export default RestaurantStats;