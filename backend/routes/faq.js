import express from 'express';
import Faq from '../models/Faq.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/faqs
// @desc    Get all FAQs (public endpoint can return only active, admin returns all)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // If accessed from admin, it might want all. For now, public gets active ones.
        // We can pass a query string ?all=true for admin.
        const filter = req.query.all ? {} : { isActive: true };
        const faqs = await Faq.find(filter).sort({ order: 1, createdAt: -1 });
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/faqs/:id
// @desc    Get single FAQ
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const faq = await Faq.findById(req.params.id);

        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        res.json(faq);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/faqs
// @desc    Create an FAQ
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const faq = await Faq.create(req.body);
        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/faqs/:id
// @desc    Update an FAQ
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const faq = await Faq.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        res.json(faq);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/faqs/:id
// @desc    Delete an FAQ
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const faq = await Faq.findByIdAndDelete(req.params.id);

        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        res.json({ message: 'FAQ removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
