import express from 'express';
import Restaurant from '../models/Restaurant.js';
import { protect, restaurantOwner, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all restaurants with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { cuisine, priceRange, features, search, sort = 'rating' } = req.query;
    const query = {};

    // Apply filters
    if (cuisine) query.cuisine = { $in: cuisine.split(',') };
    if (priceRange) query.priceRange = { $in: priceRange.split(',') };
    if (features) query.features = { $in: features.split(',') };
    if (search) query.$text = { $search: search };

    // Build sort object
    const sortObj = {};
    if (sort === 'rating') sortObj.rating = -1;
    else if (sort === 'reviewCount') sortObj.reviewCount = -1;
    
    const restaurants = await Restaurant.find(query)
      .sort(sortObj)
      .populate('owner', 'name email');

    res.json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: 'Failed to get restaurants' });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email');

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ message: 'Failed to get restaurant' });
  }
});

// @route   POST /api/restaurants
// @desc    Create a new restaurant
// @access  Private/RestaurantOwner
router.post('/', protect, restaurantOwner, async (req, res) => {
  try {
    const restaurantData = { ...req.body, owner: req.user._id };

    // Handle image URLs if provided
    if (req.body.images && Array.isArray(req.body.images)) {
      restaurantData.images = req.body.images.map(image => ({
        url: image.url,
        caption: image.caption || ''
      }));
    }

    const restaurant = new Restaurant(restaurantData);
    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ message: 'Failed to create restaurant' });
  }
});

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant
// @access  Private/RestaurantOwner/Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      // Check ownership or admin status
      if (restaurant.owner.toString() !== req.user._id.toString() && 
          req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this restaurant' });
      }

      // Update restaurant data
      Object.assign(restaurant, req.body);

      // Handle image URLs if provided
      if (req.body.images && Array.isArray(req.body.images)) {
        restaurant.images = req.body.images.map(image => ({
          url: image.url,
          caption: image.caption || ''
        }));
      }

      const updatedRestaurant = await restaurant.save();
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ message: 'Failed to update restaurant' });
  }
});

// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant
// @access  Private/RestaurantOwner/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      // Check ownership or admin status
      if (restaurant.owner.toString() !== req.user._id.toString() && 
          req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
      }

      await restaurant.remove();
      res.json({ message: 'Restaurant removed' });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ message: 'Failed to delete restaurant' });
  }
});

export default router;