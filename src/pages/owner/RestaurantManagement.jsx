import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

const RestaurantManagement = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: [],
    priceRange: '$',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    openingHours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '23:00' },
      saturday: { open: '09:00', close: '23:00' },
      sunday: { open: '09:00', close: '22:00' }
    },
    features: [],
    images: []
  });

  useEffect(() => {
    if (user?.role === 'restaurant_owner') {
      fetchRestaurantDetails();
    }
  }, [user]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get('/api/owner/restaurant');
      setRestaurant(response.data);
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching restaurant details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setImageUploading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('/api/upload/restaurant-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...response.data.images]
      }));
    } catch (error) {
      setError('Error uploading images. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await axios.delete(`/api/owner/restaurant/images/${imageId}`);
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img._id !== imageId)
      }));
    } catch (error) {
      setError('Error removing image');
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleCuisineChange = (e) => {
    const cuisines = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, cuisine: cuisines }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (restaurant) {
        await axios.put(`/api/owner/restaurant/${restaurant._id}`, formData);
      } else {
        await axios.post('/api/owner/restaurant', formData);
      }
      await fetchRestaurantDetails();
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving restaurant details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'restaurant_owner') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Unauthorized access
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Restaurant Management</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form implementation */}
      </form>
    </div>
  );
};

export default RestaurantManagement;