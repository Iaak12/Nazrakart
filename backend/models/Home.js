import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    image: { type: String, required: true },
    mobileImage: { type: String, required: true },
    link: { type: String, required: true },
    alt: { type: String, required: true }
});

const categoryCircleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    path: { type: String, required: true }
});

const franchiseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String }, // Optional, can be empty
    bgImage: { type: String }, // Optional
    path: { type: String, required: true },
    color: { type: String } // e.g., 'from-red-900 to-red-600'
});

const seoPageSchema = new mongoose.Schema({
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
});

const seoSchema = new mongoose.Schema({
    home: { type: seoPageSchema, default: () => ({}) },
    about: { type: seoPageSchema, default: () => ({}) },
    contact: { type: seoPageSchema, default: () => ({}) },
    shop: { type: seoPageSchema, default: () => ({}) },
    faq: { type: seoPageSchema, default: () => ({}) },
    careers: { type: seoPageSchema, default: () => ({}) },
});

const homeSchema = new mongoose.Schema({
    banners: {
        type: [bannerSchema],
        default: []
    },
    categories: {
        type: [categoryCircleSchema],
        default: []
    },
    franchises: {
        type: [franchiseSchema],
        default: []
    },
    seo: {
        type: seoSchema,
        default: () => ({})
    }
}, {
    timestamps: true
});

const Home = mongoose.model('Home', homeSchema);

export default Home;
