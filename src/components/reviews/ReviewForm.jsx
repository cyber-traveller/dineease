import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ReviewForm = ({ restaurantId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [review, setReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = [];
    setLoading(true);

    try {
      // Upload images through backend to maintain security
      const formData = new FormData();
      files.forEach(file => {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please upload only image files');
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error('Image size should be less than 10MB');
        }
        formData.append('images', file);
      });

      const response = await axios.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data || !response.data.urls) {
        throw new Error('Invalid response from upload service');
      }

      imageUrls.push(...response.data.urls);

      setReview(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
      setError('');
    } catch (error) {
      console.error('Error uploading images:', error);
      setError(error.message || 'Error uploading images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a review');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/reviews', {
        restaurant: restaurantId,
        ...review,
        visitDate: new Date()
      });

      setReview({
        rating: 5,
        title: '',
        comment: '',
        images: []
      });

      if (onReviewSubmitted) {
        onReviewSubmitted(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Rating</label>
          <select
            name="rating"
            value={review.rating}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            {[5, 4, 3, 2, 1].map(num => (
              <option key={num} value={num}>{num} Stars</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={review.title}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Give your review a title"
            required
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Review</label>
          <textarea
            name="comment"
            value={review.comment}
            onChange={handleInputChange}
            className="input-field h-32"
            placeholder="Share your dining experience"
            required
            maxLength={1000}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="input-field"
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;