import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Store from '../models/Store.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let store = await Store.findOne();
        if (!store) {
            store = await Store.create({});
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/', protect, admin, async (req, res) => {
    try {
        let store = await Store.findOne();
        if (!store) {
            store = new Store();
        }

        store.heroTitle = req.body.heroTitle || store.heroTitle;
        store.heroDescription = req.body.heroDescription || store.heroDescription;
        store.locations = req.body.locations || store.locations;

        const updatedStore = await store.save();
        res.json(updatedStore);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
