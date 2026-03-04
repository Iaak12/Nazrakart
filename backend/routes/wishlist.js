import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/wishlist/:productId
// @desc    Toggle product in wishlist
// @access  Private
router.post('/:productId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { productId } = req.params;

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const isWishlisted = user.wishlist.includes(productId);

        if (isWishlisted) {
            // Remove from wishlist
            user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        } else {
            // Add to wishlist
            user.wishlist.push(productId);
        }

        await user.save();

        // Return updated wishlist count
        res.json({
            message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
            isWishlisted: !isWishlisted,
            wishlistCount: user.wishlist.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/wishlist/admin
// @desc    Get most wishlisted products
// @access  Private/Admin
router.get('/admin/stats', protect, admin, async (req, res) => {
    try {
        // Aggregate to find which products are in how many users' wishlists
        const wishlistStats = await User.aggregate([
            { $unwind: "$wishlist" },
            { $group: { _id: "$wishlist", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        await Product.populate(wishlistStats, { path: '_id', select: 'name image price' });

        const formattedStats = wishlistStats.map(stat => ({
            product: stat._id,
            wishlistCount: stat.count
        })).filter(stat => stat.product != null);

        res.json(formattedStats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
