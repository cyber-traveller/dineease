import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const AddRestaurant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const cuisineTypes = [
    'Indian',
    'Italian',
    'Chinese',
    'Japanese',
    'Mexican',
    'Thai',
    'American',
    'Mediterranean',
    'French',
    'Korean'
  ];

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append all form fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'logo' && data[key][0]) {
          formData.append('logo', data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await axios.post('/api/owner/restaurant', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Restaurant added successfully!');
      reset();
      navigate('/owner/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Restaurant</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
        {/* Restaurant Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant Name *
          </label>
          <input
            type="text"
            {...register('name', { required: 'Restaurant name is required' })}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Cuisine Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuisine Type *
          </label>
          <select
            {...register('cuisineType', { required: 'Please select a cuisine type' })}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Cuisine Type</option>
            {cuisineTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.cuisineType && (
            <p className="text-red-500 text-sm mt-1">{errors.cuisineType.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            {...register('address', { required: 'Address is required' })}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            {...register('city', { required: 'City is required' })}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            {...register('state', { required: 'State is required' })}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code *
          </label>
          <input
            type="number"
            {...register('zipCode', {
              required: 'ZIP code is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'Please enter a valid 6-digit ZIP code'
              }
            })}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number *
          </label>
          <input
            type="tel"
            {...register('contactNumber', {
              required: 'Contact number is required',
              pattern: {
                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
                message: 'Please enter a valid phone number'
              }
            })}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>
          )}
        </div>

        {/* Opening Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening Time *
            </label>
            <input
              type="time"
              {...register('openingTime', { required: 'Opening time is required' })}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.openingTime && (
              <p className="text-red-500 text-sm mt-1">{errors.openingTime.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Closing Time *
            </label>
            <input
              type="time"
              {...register('closingTime', { required: 'Closing time is required' })}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.closingTime && (
              <p className="text-red-500 text-sm mt-1">{errors.closingTime.message}</p>
            )}
          </div>
        </div>

        {/* Restaurant Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant Logo
          </label>
          <input
            type="file"
            accept="image/*"
            {...register('logo')}
            onChange={handleLogoChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo preview"
              className="mt-2 h-32 w-32 object-cover rounded-md"
            />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding Restaurant...' : 'Add Restaurant'}
        </button>
      </form>
    </div>
  );
};

export default AddRestaurant;