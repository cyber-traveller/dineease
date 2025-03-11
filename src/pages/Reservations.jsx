import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Reservations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchReservations();
  }, [user, navigate]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('/reservations');
      setReservations(response.data);
    } catch (error) {
      setError('Error fetching reservations');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await axios.put(`/reservations/${reservationId}`, {
        status: 'cancelled',
        cancellationReason: 'Cancelled by user'
      });
      fetchReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      <h2 className="text-2xl font-semibold mb-4">My Reservations</h2>
      {reservations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">You don't have any reservations yet.</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="mt-4 btn-primary"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={reservation.restaurant.images[0]}
                  alt={reservation.restaurant.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {reservation.restaurant.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {`${reservation.restaurant.address.street}, ${reservation.restaurant.address.city}, ${reservation.restaurant.address.state} ${reservation.restaurant.address.zipCode}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(reservation.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Time</p>
                  <p className="font-medium">{reservation.time}</p>
                </div>
                <div>
                  <p className="text-gray-600">Party Size</p>
                  <p className="font-medium">{reservation.partySize} people</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reservation.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : reservation.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {reservation.status.charAt(0).toUpperCase() +
                      reservation.status.slice(1)}
                  </span>
                </div>
              </div>

              {reservation.specialRequests && (
                <div>
                  <p className="text-gray-600 text-sm">Special Requests</p>
                  <p className="text-sm">{reservation.specialRequests}</p>
                </div>
              )}

              {['pending', 'confirmed'].includes(reservation.status) && (
                <button
                  onClick={() => handleCancelReservation(reservation._id)}
                  className="w-full btn-secondary"
                >
                  Cancel Reservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;