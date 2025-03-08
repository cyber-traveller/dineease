import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import PaymentForm from '../components/payment/PaymentForm';
import { createReservationImageData } from '../utils/imageUtils';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState({
    date: '',
    time: '',
    partySize: 2,
    specialRequests: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [reservationId, setReservationId] = useState(null);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(`/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservation(prev => ({ ...prev, [name]: value }));
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const imageData = createReservationImageData(restaurant);
      const response = await axios.post('/reservations', {
        restaurantId: id,
        restaurantImage: imageData.url,
        restaurantName: imageData.name,
        ...reservation
      });

      setReservationId(response.data._id);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const handlePaymentSuccess = async (paymentId) => {
    navigate(`/reservations`);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : !restaurant ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Restaurant not found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Restaurant Header */}
          <div className="relative h-96 rounded-xl overflow-hidden">
            <img
              src={restaurant.images[0]?.url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
              <div className="flex items-center space-x-4 text-white">
                <span className="text-primary-light font-medium">{restaurant.priceRange}</span>
                <span>•</span>
                <span>{restaurant.cuisine}</span>
                <span>•</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Restaurant Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <h2 className="text-2xl font-semibold">About</h2>
                <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Location</h3>
                  <p className="text-gray-600">
                    {`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zipCode}, ${restaurant.address.country}`}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Hours</h3>
                  <div className="space-y-2">
                    {Object.entries(restaurant.openingHours || {}).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-gray-600">
                        <span className="capitalize">{day}</span>
                        <span>{hours.open} - {hours.close}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-6">
                <ReviewList restaurantId={id} />
                <ReviewForm restaurantId={id} onReviewSubmitted={() => fetchRestaurant()} />
              </div>
            </div>

            {/* Reservation Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h2 className="text-2xl font-semibold mb-6">Make a Reservation</h2>
                <form onSubmit={handleReservationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={reservation.date}
                      onChange={handleReservationChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={reservation.time}
                      onChange={handleReservationChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Party Size</label>
                    <input
                      type="number"
                      name="partySize"
                      value={reservation.partySize}
                      onChange={handleReservationChange}
                      min="1"
                      max="20"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={reservation.specialRequests}
                      onChange={handleReservationChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors h-24 resize-none"
                      placeholder="Any special requests or dietary restrictions?"
                    />
                  </div>
                  {!showPayment ? (
                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors font-medium"
                    >
                      {user ? 'Proceed to Payment' : 'Login to Reserve'}
                    </button>
                  ) : (
                    <PaymentForm
                      amount={5000}
                      reservationId={reservationId}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;