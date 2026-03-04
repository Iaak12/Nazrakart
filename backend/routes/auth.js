import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin phone number for OTP verification
const ADMIN_PHONE = process.env.ADMIN_PHONE_NUMBER || '7979850684';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route   POST /api/auth/register
// @desc    Register a new customer
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create customer user (no admin registration here)
        const user = await User.create({
            name,
            email,
            password,
            role: 'customer'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/admin/send-otp
// @desc    Send OTP to admin phone number for verification
// @access  Public
router.post('/admin/send-otp', async (req, res) => {
    try {
        const { phone, email, name } = req.body;

        // Check if phone matches admin phone
        // Removed validation to allow open demo registration
        // if (phone !== ADMIN_PHONE) {
        //    return res.status(403).json({ message: 'Unauthorized phone number. Admin registration not allowed.' });
        // }

        // Check if email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP with email as key (expires in 5 minutes)
        otpStore.set(email, {
            otp,
            phone,
            name,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        // In production, send SMS here via Twilio, etc.
        // For demo, we'll log it and send in response (remove in production!)
        console.log(`\n📱 OTP for admin registration: ${otp}\n`);

        res.json({
            message: 'OTP sent successfully to your phone',
            // Remove this in production! Only for demo
            demoOTP: otp
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/admin/verify-otp
// @desc    Verify OTP and create admin account
// @access  Public
router.post('/admin/verify-otp', async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        // Get stored OTP data
        const otpData = otpStore.get(email);

        if (!otpData) {
            return res.status(400).json({ message: 'OTP expired or not requested. Please try again.' });
        }

        // Check if OTP expired
        if (Date.now() > otpData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        // Verify OTP
        if (otp !== otpData.otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // OTP verified - create admin user
        const user = await User.create({
            name: otpData.name,
            email,
            password,
            phone: otpData.phone,
            role: 'admin'
        });

        // Clean up OTP
        otpStore.delete(email);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user (customer)
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/admin/login
// @desc    Admin-only login
// @access  Public
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
});

export default router;
