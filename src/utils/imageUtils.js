// Utility functions for handling restaurant images

/**
 * Validates a restaurant image URL and returns either the valid URL or a fallback
 * @param {string} imageUrl - The URL of the restaurant image
 * @param {string} fallbackUrl - Optional fallback URL if the image is invalid
 * @returns {string} - Valid image URL or fallback URL
 */
export const validateRestaurantImage = (imageUrl, fallbackUrl = '/images/placeholder-restaurant.jpg') => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return fallbackUrl;
  }

  // Basic URL validation
  try {
    new URL(imageUrl);
    return imageUrl;
  } catch (error) {
    console.warn('Invalid image URL:', imageUrl);
    return fallbackUrl;
  }
};

/**
 * Safely gets the first valid image URL from a restaurant's images array
 * @param {Object} restaurant - The restaurant object
 * @param {string} fallbackUrl - Optional fallback URL if no valid image is found
 * @returns {string} - Valid image URL or fallback URL
 */
export const getRestaurantImageUrl = (restaurant, fallbackUrl = '/images/placeholder-restaurant.jpg') => {
  if (!restaurant || !Array.isArray(restaurant.images)) {
    return fallbackUrl;
  }

  const firstImage = restaurant.images[0];
  return validateRestaurantImage(firstImage?.url, fallbackUrl);
};

/**
 * Creates a secure image URL object for storing in the reservation
 * @param {Object} restaurant - The restaurant object
 * @returns {Object} - Object containing validated image URL and name
 */
export const createReservationImageData = (restaurant) => {
  if (!restaurant || !restaurant.images || !Array.isArray(restaurant.images)) {
    return {
      url: '/images/placeholder-restaurant.jpg',
      name: 'Restaurant'
    };
  }

  const imageUrl = restaurant.images[0]?.url || '/images/placeholder-restaurant.jpg';
  return {
    url: imageUrl,
    name: restaurant?.name || 'Restaurant'
  };
};