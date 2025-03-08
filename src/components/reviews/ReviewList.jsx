import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
      const response = await axios.get(`/api/reviews?restaurant=${restaurantId}`);
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
      await axios.delete(`/api/reviews/${reviewId}`);
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
      const response = await axios.post(`/api/reviews/${reviewId}/replies`, {
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
      await axios.delete(`/api/reviews/${reviewId}/replies/${replyId}`);
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
          {reviews.map(review => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{review.rating} stars</span>
                  </div>
                  <h4 className="font-semibold">{review.title}</h4>
                </div>
                {user && review.user && (user._id === review.user._id || user.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-600 mb-4">{review.comment}</p>
              {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={typeof image === 'string' ? image : image.url}
                      alt={`Review image ${index + 1}`}
                      className="h-24 w-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <span>By {review.user ? review.user.name : 'Unknown User'}</span>
                <span className="mx-2">•</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              {/* Review Replies */}
              {review.replies && review.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 border-gray-200">
                  {review.replies.map((reply, index) => (
                    <div key={index} className="mb-3 bg-gray-50 p-4 rounded">
                      <p className="text-gray-700 mb-2">{reply.comment}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>Response from {reply.user.name}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                        {user && user._id === reply.user._id && (
                          <button
                            onClick={() => handleDeleteReply(review._id, reply._id)}
                            className="ml-4 text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete Response
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Reply Form for Restaurant Owners */}
              {user && user.role === 'owner' && (
                <div className="mt-4">
                  <form onSubmit={(e) => handleReplySubmit(e, review._id)} className="space-y-3">
                    <textarea
                      value={replyText[review._id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [review._id]: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Write a response..."
                      rows="3"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                    >
                      Post Response
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;