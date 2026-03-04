import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    city: { type: String, required: true },
    branch: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    hours: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' }
});

const storeSchema = new mongoose.Schema({
    heroTitle: { type: String, default: 'Our Stores' },
    heroDescription: { type: String, default: 'Experience our products in person. Find a NazraKart store near you and explore our latest collections.' },
    locations: {
        type: [locationSchema],
        default: [
            {
                city: 'Mumbai',
                branch: 'Bandra West (Flagship)',
                address: 'Shop No 4, Ground Floor, Linking Road, Bandra West, Mumbai, Maharashtra 400050',
                phone: '+91 98765 43210',
                hours: '11:00 AM - 10:00 PM (Everyday)',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'
            },
            {
                city: 'New Delhi',
                branch: 'Connaught Place',
                address: 'Block C, Inner Circle, Connaught Place, New Delhi, Delhi 110001',
                phone: '+91 98765 43211',
                hours: '11:00 AM - 9:30 PM (Everyday)',
                image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80'
            }
        ]
    }
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
export default Store;
