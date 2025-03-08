import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-display font-bold text-primary">
            DineEase
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/restaurants" className="text-dark hover:text-primary transition-colors">
              Restaurants
            </Link>
            {user && user.role === 'user' && (
              <Link to="/reservations" className="text-dark hover:text-primary transition-colors">
                My Reservations
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-dark hover:text-primary transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                {user.role === 'restaurant_owner' && (
                  <Link to="/owner/dashboard" className="text-dark hover:text-primary transition-colors">
                    Owner Dashboard
                  </Link>
                )}
                <Link to="/profile" className="text-dark hover:text-primary transition-colors">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-dark hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;