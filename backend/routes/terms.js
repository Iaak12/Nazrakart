import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Terms from '../models/Terms.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let terms = await Terms.findOne();
        if (!terms) {
            terms = await Terms.create({});
        }
        res.json(terms);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/', protect, admin, async (req, res) => {
    try {
        let terms = await Terms.findOne();
        if (!terms) {
            terms = new Terms();
        }

        terms.content = req.body.content || terms.content;
        terms.lastUpdated = req.body.lastUpdated || terms.lastUpdated;

        const updatedTerms = await terms.save();
        res.json(updatedTerms);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
