import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/watchlist
// @desc    Get user watchlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user.watchlist || []);
  } catch (error) {
    console.error('Watchlist fetch error:', error);
    res.status(500).json({ error: 'Server error fetching watchlist' });
  }
});

// @route   POST /api/watchlist/add
// @desc    Add company to watchlist
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'Please provide a company name' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user.watchlist) {
      user.watchlist = [];
    }

    // Check if already in watchlist (case-insensitive)
    const exists = user.watchlist.some(
      (c) => c.toLowerCase() === companyName.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({ error: 'Company already in watchlist' });
    }

    user.watchlist.push(companyName);
    await user.save();

    res.status(200).json(user.watchlist);
  } catch (error) {
    console.error('Watchlist add error:', error);
    res.status(500).json({ error: 'Server error adding to watchlist', details: error.message });
  }
});

// @route   POST /api/watchlist/remove
// @desc    Remove company from watchlist
// @access  Private
router.post('/remove', protect, async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'Please provide a company name' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user.watchlist) {
      user.watchlist = [];
    }

    user.watchlist = user.watchlist.filter(
      (c) => c.toLowerCase() !== companyName.toLowerCase()
    );

    await user.save();

    res.status(200).json(user.watchlist);
  } catch (error) {
    console.error('Watchlist remove error:', error);
    res.status(500).json({ error: 'Server error removing from watchlist', details: error.message });
  }
});

export default router;
