import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

const ReviewList = ({ restaurantId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/reviews?restaurant=${restaurantId}`);
      setReviews(response.data);
    } catch (error) {
      setError('Error fetching reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await axios.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review._id !== reviewId));
      setError('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting review';
      setError(errorMessage);
      console.error('Error deleting review:', error);
    }
  };

  const handleReplySubmit = async (e, reviewId) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/reviews/${reviewId}/replies`, {
        comment: replyText[reviewId]
      });
      setReviews(reviews.map(review =>
        review._id === reviewId ? response.data : review
      ));
      setReplyText({ ...replyText, [reviewId]: '' });
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    if (!window.confirm('Are you sure you want to delete this response?')) {
      return;
    }
    try {
      await axios.delete(`/reviews/${reviewId}/replies/${replyId}`);
      setReviews(reviews.map(review => {
        if (review._id === reviewId) {
          return {
            ...review,
            replies: review.replies.filter(reply => reply._id !== replyId)
          };
        }
        return review;
      }));
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{review.user?.name || 'Anonymous'}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                    <span className="text-gray-400">{'★'.repeat(5 - review.rating)}</span>
                  </div>
                </div>
                {(user?._id === review.user?._id || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-2">{review.comment}</p>
              
              {/* Display review images if any */}
              {review.images && review.images.length > 0 && (
                <div className="mt-2 flex space-x-2">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Review image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {/* Replies section */}
              <div className="mt-4 space-y-2">
                {review.replies && review.replies.map((reply) => (
                  <div key={reply._id} className="ml-4 p-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-start">
                      <p>
                        <span className="font-semibold">{reply.user?.name || 'Staff'}</span>:
                        {' '}{reply.comment}
                      </p>
                      {(user?._id === reply.user?._id || user?.role === 'admin') && (
                        <button
                          onClick={() => handleDeleteReply(review._id, reply._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Reply form for restaurant owners */}
                {user?.role === 'restaurant_owner' && (
                  <form onSubmit={(e) => handleReplySubmit(e, review._id)} className="mt-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={replyText[review._id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [review._id]: e.target.value })}
                        placeholder="Write a response..."
                        className="flex-1 p-2 border rounded"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                      >
                        Reply
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;