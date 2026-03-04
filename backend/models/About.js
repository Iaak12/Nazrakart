import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
    iconName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
});

const aboutSchema = new mongoose.Schema({
    heroTitle: {
        type: String,
        required: true,
        default: 'About NazraKart'
    },
    heroDescription: {
        type: String,
        required: true,
        default: 'We are your ultimate destination for premium pop-culture merchandise. Our mission is to bring your favorite characters, movies, and TV shows to life through high-quality apparel and accessories.'
    },
    storyTitle: {
        type: String,
        required: true,
        default: 'Our Story'
    },
    storyParagraph1: {
        type: String,
        required: true,
        default: 'Founded with a passion for pop culture and a commitment to quality, NazraKart started as a small idea that grew into a massive community. We noticed a gap in the market for merchandise that was both stylish and comfortable, so we decided to create our own.'
    },
    storyParagraph2: {
        type: String,
        required: true,
        default: 'Today, we partner with top franchises and independent artists to bring you an ever-expanding catalog of exclusive designs. Whether you are a superhero fanatic, an anime lover, or a gaming enthusiast, we have something special just for you.'
    },
    features: {
        type: [featureSchema],
        default: [
            {
                iconName: 'MdHighQuality',
                title: 'Premium Quality',
                description: 'We use only the best materials to ensure our products are comfortable, durable, and look amazing.'
            },
            {
                iconName: 'MdStorefront',
                title: 'Exclusive Designs',
                description: 'Our in-house design team creates unique, eye-catching apparel you will not find anywhere else.'
            },
            {
                iconName: 'MdPeople',
                title: 'Community First',
                description: 'We are more than just a brand; we are a community of passionate fans and pop-culture enthusiasts.'
            },
            {
                iconName: 'MdLocalShipping',
                title: 'Fast Delivery',
                description: 'We work hard to get your favorite merchandise delivered to your doorstep as quickly as possible.'
            }
        ]
    }
}, {
    timestamps: true
});

const About = mongoose.model('About', aboutSchema);

export default About;
