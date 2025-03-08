import express from 'express';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [restaurants, reservations, reviews] = await Promise.all([
      Restaurant.find(),
      Reservation.find(),
      Review.find()
    ]);

    const stats = {
      totalReservations: reservations.length,
      totalRevenue: reservations
        .filter(r => r.payment && r.payment.status === 'completed')
        .reduce((sum, r) => sum + (r.payment.amount || 0), 0),
      averageRating: restaurants.reduce((sum, r) => sum + (r.rating || 0), 0) / (restaurants.length || 1),
      activeRestaurants: restaurants.filter(r => r.isActive).length
    };

    res.json(stats);
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Failed to get admin statistics' });
  }
});

// @route   GET /api/admin/restaurants
// @desc    Get all restaurants for admin
// @access  Private/Admin
router.get('/restaurants', protect, admin, async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(restaurants);
  } catch (error) {
    console.error('Get admin restaurants error:', error);
    res.status(500).json({ message: 'Failed to get restaurants' });
  }
});

// @route   PATCH /api/admin/restaurants/:id
// @desc    Update restaurant status
// @access  Private/Admin
router.patch('/restaurants/:id', protect, admin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.isActive = req.body.isActive;
    const updatedRestaurant = await restaurant.save();

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Update restaurant status error:', error);
    res.status(500).json({ message: 'Failed to update restaurant status' });
  }
});

export default router;