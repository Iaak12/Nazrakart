import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/uploadRoutes.js';
import settingsRoutes from './routes/settings.js';
import contactRoutes from './routes/contact.js';
import themeRoutes from './routes/themes.js';
import faqRoutes from './routes/faq.js';
import aboutRoutes from './routes/about.js';
import homeRoutes from './routes/home.js';
import dashboardRoutes from './routes/dashboard.js';
import careerRoutes from './routes/careers.js';
import storeRoutes from './routes/stores.js';
import termsRoutes from './routes/terms.js';
import privacyRoutes from './routes/privacy.js';
import wishlistRoutes from './routes/wishlist.js';
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Manual CORS middleware — works regardless of env var issues
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://nazrakart.vercel.app'
];

if (process.env.FRONTEND_URL) {
    const cleanUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    if (!allowedOrigins.includes(cleanUrl)) allowedOrigins.push(cleanUrl);
}

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Handle preflight immediately
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/terms', termsRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/wishlist', wishlistRoutes);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'NazraKart API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
