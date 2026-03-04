import express from 'express';
import About from '../models/About.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/about
// @desc    Get about us content (creates default if none exists)
// @access  Public
router.get('/', async (req, res) => {
    try {
        let about = await About.findOne();

        // Seed if doesn't exist
        if (!about) {
            about = await About.create({});
        }

        res.json(about);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/about
// @desc    Update about us content
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
    try {
        let about = await About.findOne();

        if (!about) {
            about = await About.create(req.body);
            return res.status(201).json(about);
        }

        about.heroTitle = req.body.heroTitle || about.heroTitle;
        about.heroDescription = req.body.heroDescription || about.heroDescription;
        about.storyTitle = req.body.storyTitle || about.storyTitle;
        about.storyParagraph1 = req.body.storyParagraph1 || about.storyParagraph1;
        about.storyParagraph2 = req.body.storyParagraph2 || about.storyParagraph2;

        if (req.body.features) {
            about.features = req.body.features;
        }

        const updatedAbout = await about.save();
        res.json(updatedAbout);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
