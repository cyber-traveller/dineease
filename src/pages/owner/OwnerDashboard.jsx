import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('/owner/restaurant');
        if (response.data) {
          setRestaurants([response.data]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setError('Unable to load restaurant data. Please try again later.');
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'restaurant_owner') {
      fetchRestaurants();
    } else {
      setLoading(false);
      setError('Please log in as a restaurant owner to access this dashboard.');
    }
  }, [user]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse text-lg">Loading restaurant data...</div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Restaurant Owner Dashboard</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">{restaurant.name}</h2>
                <p className="text-gray-600 mb-4">{restaurant.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Status: {restaurant.status}
                  </span>
                  <button
                    onClick={() => navigate(`/owner/restaurant/${restaurant._id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No restaurants found.</p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/owner/add-restaurant')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
          >
            <span className="mr-2">+</span>
            Add New Restaurant
          </button>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default OwnerDashboard;