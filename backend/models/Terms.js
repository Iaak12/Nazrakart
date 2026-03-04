import mongoose from 'mongoose';

const termsSchema = new mongoose.Schema({
    content: {
        type: String,
        default: 'Welcome to NazraKart. These Terms & Conditions govern your use of our website and the purchase of our products.'
    },
    lastUpdated: { type: String, default: 'March 4, 2026' }
}, { timestamps: true });

const Terms = mongoose.model('Terms', termsSchema);
export default Terms;
