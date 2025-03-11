import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    cuisine: [],
    priceRange: '',
    search: '',
    minRating: '',
    features: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.cuisine.length > 0) params.append('cuisine', filters.cuisine.join(','));
      if (filters.priceRange) params.append('priceRange', filters.priceRange);
      if (filters.search) params.append('search', filters.search);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.features.length > 0) params.append('features', filters.features.join(','));

      const response = await axios.get(`/restaurants?${params.toString()}`);
      console.log('Restaurants response:', response.data);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cuisine') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      const filteredOptions = selectedOptions.filter(option => option !== '');
      setFilters(prev => ({ ...prev, [name]: filteredOptions }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Find Your Perfect Restaurant</h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search by name, cuisine, or location..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
              <div className="relative">
                <div className="w-full p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors bg-white">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Italian", "Chinese", "Indian", "Japanese", "Mexican",
                      "Thai", "Mediterranean", "French", "American", "Korean"
                    ].map((cuisine) => (
                      <label key={cuisine} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          name="cuisine"
                          value={cuisine}
                          checked={filters.cuisine.includes(cuisine)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFilters(prev => ({
                              ...prev,
                              cuisine: e.target.checked
                                ? [...prev.cuisine, value]
                                : prev.cuisine.filter(c => c !== value)
                            }));
                          }}
                          className="text-primary focus:ring-primary h-4 w-4 rounded"
                        />
                        <span className="text-gray-700">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">Select multiple cuisines</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">

                {['$', '$$', '$$$', '$$$$'].map((price) => (
                  <label key={price} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      value={price}
                      checked={filters.priceRange === price}
                      onChange={handleFilterChange}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-gray-700">{price}</span>
                  </label>
                ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <option value="">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Outdoor Seating", "Wifi", "Parking", "Bar",
                    "Live Music", "Private Dining"
                  ].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        name="features"
                        value={feature}
                        checked={filters.features.includes(feature)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFilters(prev => ({
                            ...prev,
                            features: e.target.checked
                              ? [...prev.features, value]
                              : prev.features.filter(f => f !== value)
                          }));
                        }}
                        className="text-primary focus:ring-primary h-4 w-4 rounded"
                      />
                      <span className="text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map(restaurant => (
          <Link
            key={restaurant._id}
            to={`/restaurants/${restaurant._id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={restaurant.images[0]?.url}
                alt={restaurant.name}
                className="object-cover w-full h-48"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
              <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">{restaurant.priceRange}</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No restaurants found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurants;