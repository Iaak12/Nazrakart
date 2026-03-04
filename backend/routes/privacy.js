import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Privacy from '../models/Privacy.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let privacy = await Privacy.findOne();
        if (!privacy) {
            privacy = await Privacy.create({});
        }
        res.json(privacy);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/', protect, admin, async (req, res) => {
    try {
        let privacy = await Privacy.findOne();
        if (!privacy) {
            privacy = new Privacy();
        }

        privacy.content = req.body.content || privacy.content;
        privacy.lastUpdated = req.body.lastUpdated || privacy.lastUpdated;

        const updatedPrivacy = await privacy.save();
        res.json(updatedPrivacy);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
