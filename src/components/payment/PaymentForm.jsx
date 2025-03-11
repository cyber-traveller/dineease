import React, { useState } from 'react';
import axios from '../../utils/axios';

const PaymentForm = ({ amount, reservationId, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle');

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg ${type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 4500);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      setPaymentStatus('processing');

      const res = await initializeRazorpay();
      if (!res) {
        setError('Razorpay SDK failed to load. Please check your internet connection and try again.');
        setPaymentStatus('failed');
        return;
      }

      const { data } = await axios.post('/payments/create-order', {
        amount,
        reservationId
      });

      // Make sure we have the Razorpay key ID
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        console.error('Razorpay Key ID is missing in environment variables');
        setError('Payment configuration error. Please contact support.');
        setPaymentStatus('failed');
        return;
      }

      const options = {
        key: razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: 'DineEase',
        description: 'Restaurant Reservation Payment',
        order_id: data.id,
        handler: async (response) => {
          try {
            setLoading(true);
            setPaymentStatus('verifying');
            showNotification('Verifying payment...', 'info');
            
            await axios.post('/payments/verify', {
              reservationId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });

            setPaymentStatus('success');
            showNotification('Payment successful! Your reservation is confirmed. Redirecting to reservations page...');
            setTimeout(() => onPaymentSuccess(response.razorpay_payment_id), 2000);
          } catch (error) {
            setPaymentStatus('failed');
            const errorMessage = error.response?.data?.message || 'Payment verification failed';
            setError(`${errorMessage}. If the amount was deducted, please contact our support team.`);
            showNotification('Payment verification failed. Please contact support.', 'error');
            onPaymentError(error);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setPaymentStatus('idle');
            showNotification('Payment cancelled. You can try again.', 'info');
          },
          escape: true,
          animation: true
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setPaymentStatus('failed');
      const errorMessage = error.response?.data?.message || 'Payment initialization failed';
      setError(`${errorMessage}. Please try again.`);
      showNotification('Payment initialization failed. Please try again.', 'error');
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Initializing Payment...';
      case 'verifying':
        return 'Verifying Payment...';
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Retry Payment';
      default:
        return `Pay ₹${amount / 100}`;
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading || paymentStatus === 'verifying'}
        className={`btn-primary w-full transition-colors duration-200 ${loading || paymentStatus === 'verifying' ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default PaymentForm;