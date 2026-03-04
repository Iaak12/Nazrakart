import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get store settings
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // If no settings exist yet, create default settings
        if (!settings) {
            settings = await Settings.create({});
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/settings
// @desc    Update store settings
// @access  Public (should be Admin Private in production)
router.put('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (settings) {
            // Update existing
            settings = await Settings.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
        } else {
            // Create new
            settings = await Settings.create(req.body);
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
