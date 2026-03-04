import express from 'express';
import Theme from '../models/Theme.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/themes
// @desc    Get all themes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const themes = await Theme.find({ isActive: true }).sort({ name: 1 });
        res.json(themes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/themes/:id
// @desc    Get single theme
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const theme = await Theme.findById(req.params.id);

        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }

        res.json(theme);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/themes
// @desc    Create a theme
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const existingTheme = await Theme.findOne({ name: req.body.name });
        if (existingTheme) {
            return res.status(400).json({ message: 'Theme name already exists' });
        }
        const theme = await Theme.create(req.body);
        res.status(201).json(theme);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/themes/:id
// @desc    Update a theme
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const theme = await Theme.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }

        res.json(theme);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/themes/:id
// @desc    Delete a theme
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const theme = await Theme.findByIdAndDelete(req.params.id);

        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }

        res.json({ message: 'Theme removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
