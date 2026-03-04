import mongoose from 'mongoose';

const privacySchema = new mongoose.Schema({
    content: {
        type: String,
        default: 'At NazraKart, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your information.'
    },
    lastUpdated: { type: String, default: 'March 4, 2026' }
}, { timestamps: true });

const Privacy = mongoose.model('Privacy', privacySchema);
export default Privacy;
