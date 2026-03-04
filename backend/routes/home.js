import express from 'express';
import Home from '../models/Home.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

const SEED_DATA = {
    banners: [
        {
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Homepage-Banner_7_R5uTbdT.jpg?format=webp&w=1500&dpr=1.0',
            mobileImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Hompage-Banner_3_b6e4Fto.jpg?format=webp&w=480&dpr=1.0',
            link: '/shop?theme=Marvel',
            alt: 'Marvel Official Merchandise'
        },
        {
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Web-banner_4_jX2yVf4.jpg?format=webp&w=1500&dpr=1.0',
            mobileImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/App-banner_4_G8cR7Nf.jpg?format=webp&w=480&dpr=1.0',
            link: '/shop?category=topwear',
            alt: 'Summer Tees collection'
        },
        {
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Web-banner_5_lG9zHj8.jpg?format=webp&w=1500&dpr=1.0',
            mobileImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/App-banner_5_K3pM4Xq.jpg?format=webp&w=480&dpr=1.0',
            link: '/shop?theme=DC',
            alt: 'DC Universe'
        }
    ],
    categories: [
        { name: 'OVERSIZED T-SHIRTS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_4_gG3z8rS.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=oversized' },
        { name: 'CLASSIC FIT T-SHIRTS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_5_vX1b6hP.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=classic' },
        { name: 'SHIRTS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_6_hJ9n2kL.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=shirts' },
        { name: 'SNEAKERS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_7_pQ4m1wD.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=sneakers' },
        { name: 'JEANS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_8_tR3c5vB.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=jeans' },
        { name: 'CARGOS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_9_zS2f8xN.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=cargos' }
    ],
    franchises: [
        {
            name: 'Marvel',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/Marvel_Logo_xGpJx8s.jpg?format=webp&w=480&dpr=1.0',
            bgImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/franchise-bg-marvel_mD2f1K.jpg?format=webp&w=480&dpr=1.0',
            path: '/shop?theme=Marvel',
            color: 'from-red-900 to-red-600'
        },
        {
            name: 'DC Comics',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/DC_Logo_qR3w4E.jpg?format=webp&w=480&dpr=1.0',
            bgImage: '',
            path: '/shop?theme=DC',
            color: 'from-blue-900 to-blue-600'
        },
        {
            name: 'Harry Potter',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/HP_Logo_tY7u8I.jpg?format=webp&w=480&dpr=1.0',
            bgImage: '',
            path: '/shop?theme=Harry+Potter',
            color: 'from-yellow-900 to-yellow-600'
        },
        {
            name: 'Star Wars',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/SW_Logo_oP9l2K.jpg?format=webp&w=480&dpr=1.0',
            bgImage: '',
            path: '/shop?theme=Star+Wars',
            color: 'from-gray-900 to-black'
        }
    ]
};

// @route   GET /api/home
// @desc    Get home page content (creates default from seed if none exists)
// @access  Public
router.get('/', async (req, res) => {
    try {
        let home = await Home.findOne();

        // Seed if doesn't exist
        if (!home) {
            home = await Home.create(SEED_DATA);
        }

        res.json(home);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/home
// @desc    Update home page content
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
    try {
        let home = await Home.findOne();

        if (!home) {
            home = await Home.create(req.body);
            return res.status(201).json(home);
        }

        if (req.body.banners) home.banners = req.body.banners;
        if (req.body.categories) home.categories = req.body.categories;
        if (req.body.franchises) home.franchises = req.body.franchises;

        const updatedHome = await home.save();
        res.json(updatedHome);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
