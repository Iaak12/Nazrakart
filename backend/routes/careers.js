import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Career from '../models/Career.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let career = await Career.findOne();
        if (!career) {
            career = await Career.create({});
        }
        res.json(career);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/', protect, admin, async (req, res) => {
    try {
        let career = await Career.findOne();
        if (!career) {
            career = new Career();
        }

        career.heroTitle = req.body.heroTitle || career.heroTitle;
        career.heroDescription = req.body.heroDescription || career.heroDescription;
        career.jobs = req.body.jobs || career.jobs;

        const updatedCareer = await career.save();
        res.json(updatedCareer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
