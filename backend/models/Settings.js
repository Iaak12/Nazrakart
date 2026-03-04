import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    storeName: { type: String, default: 'NazraKart' },
    storeEmail: { type: String, default: 'contact@nazrakart.com' },
    storePhone: { type: String, default: '7979850684' },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'America/New_York' },
    orderNotifications: { type: Boolean, default: true },
    stockAlerts: { type: Boolean, default: true },
    emailMarketing: { type: Boolean, default: false },
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: String, default: '30' },
    freeShippingThreshold: { type: String, default: '50' },
    defaultShippingRate: { type: String, default: '5.99' },
    primaryColor: { type: String, default: '#6366f1' },
    darkMode: { type: Boolean, default: true },
    headerLogo: { type: String, default: '' },
    footerLogo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    footerDescription: { type: String, default: 'Official merchandise. Pop culture heaven. We make cool things for cool people.' },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    },
    siteTitle: { type: String, default: 'NazraKart - Official Merchandise' },
    siteDescription: { type: String, default: 'Official merchandise. Pop culture heaven. We make cool things for cool people.' },
    siteKeywords: { type: String, default: 'ecommerce, merchandise, clothing, pop culture' },
    razorpay: {
        enabled: { type: Boolean, default: false },
        keyId: { type: String, default: '' },
        keySecret: { type: String, default: '' }
    },
    stripe: {
        enabled: { type: Boolean, default: false },
        publicKey: { type: String, default: '' },
        secretKey: { type: String, default: '' }
    },
    paypal: {
        enabled: { type: Boolean, default: false },
        clientId: { type: String, default: '' },
        clientSecret: { type: String, default: '' }
    },
    upi: {
        enabled: { type: Boolean, default: false },
        upiId: { type: String, default: '' },
        payeeName: { type: String, default: '' }
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
