import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/owner/restaurant/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleReplySubmit = async (reviewId, replyText) => {
    try {
      await axios.post(`/api/reviews/${reviewId}/reply`, { text: replyText });
      // Refresh reviews after reply
      const response = await axios.get('/api/owner/restaurant/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const getStarRating = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filter));

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reviews Management</h1>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{review.user.name}</h3>
                <p className="text-yellow-500">{getStarRating(review.rating)}</p>
                <p className="text-gray-600 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {review.rating} / 5
              </span>
            </div>

            <p className="text-gray-700 mb-4">{review.text}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-4 mb-4">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Review ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Reply Section */}
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Replies</h4>
              {review.replies && review.replies.map((reply, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-2">
                  <p className="font-medium">{reply.user.name}</p>
                  <p className="text-gray-600">{reply.text}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const replyText = e.target.reply.value;
                  if (replyText.trim()) {
                    handleReplySubmit(review._id, replyText);
                    e.target.reply.value = '';
                  }
                }}
                className="mt-4"
              >
                <textarea
                  name="reply"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Write a reply..."
                  rows="2"
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Reply
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsManagement;