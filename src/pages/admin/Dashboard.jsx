import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import RestaurantManagement from './RestaurantManagement';
import ReviewManagement from './ReviewManagement';
import ReservationManagement from './ReservationManagement';
import DashboardStats from '../../components/admin/DashboardStats';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <DashboardStats />
      <nav className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <NavLink
          to="/admin/restaurants"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all ${isActive
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`
          }
        >
          Restaurants
        </NavLink>
        <NavLink
          to="/admin/reviews"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all ${isActive
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`
          }
        >
          Reviews
        </NavLink>
        <NavLink
          to="/admin/reservations"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all ${isActive
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`
          }
        >
          Reservations
        </NavLink>
      </nav>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Routes>
          <Route path="/" element={<RestaurantManagement />} />
          <Route path="/restaurants" element={<RestaurantManagement />} />
          <Route path="/reviews" element={<ReviewManagement />} />
          <Route path="/reservations" element={<ReservationManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;