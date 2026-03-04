import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();

        // Create admin user (ONLY way to create admin - via this seed script)
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@nazrakart.com',
            password: 'admin@NazraKart12',
            role: 'admin',
            phone: process.env.ADMIN_PHONE_NUMBER || '7979850684'
        });

        // Create test customer
        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'customer'
        });

        console.log('✓ Users created');
        console.log('');
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                    ADMIN CREDENTIALS                        ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log('║  Email:    admin@nazrakart.com                              ║');
        console.log('║  Password: admin123                                         ║');
        console.log('║                                                             ║');
        console.log('║  Admin Login: http://localhost:5174/admin/login             ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log('');

        // Create categories
        const categories = await Category.insertMany([
            { name: 'T-Shirts', slug: 't-shirts', description: 'Graphic and plain t-shirts' },
            { name: 'Shirts', slug: 'shirts', description: 'Casual and formal shirts' },
            { name: 'Joggers', slug: 'joggers', description: 'Comfortable joggers and sweatpants' },
            { name: 'Jeans', slug: 'jeans', description: 'Denim jeans' },
            { name: 'Shoes', slug: 'shoes', description: 'Sneakers and casual shoes' },
            { name: 'Accessories', slug: 'accessories', description: 'Caps, bags, and more' },
            { name: 'Topwear', slug: 'topwear', description: 'All topwear' },
            { name: 'Bottomwear', slug: 'bottomwear', description: 'All bottomwear' }
        ]);

        console.log('✓ Categories created');

        // Create products
        const categoryMap = {};
        categories.forEach(cat => categoryMap[cat.name] = cat._id);

        await Product.insertMany([
            { name: 'Marvel: Spider-Man Logo View', description: 'Official Marvel Spider-Man T-Shirt', price: 999, memberPrice: 899, comparePrice: 1299, category: categoryMap['T-Shirts'], stock: 45, images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], featured: true, rating: 4.8, brand: 'The Souled Store', gender: 'Men', theme: 'Marvel', sizes: ['S', 'M', 'L'] },
            { name: 'Batman: The Dark Knight', description: 'Official DC Batman T-Shirt', price: 799, memberPrice: 699, comparePrice: 999, category: categoryMap['T-Shirts'], stock: 28, images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], featured: true, rating: 4.9, brand: 'The Souled Store', gender: 'Men', theme: 'DC', sizes: ['M', 'L', 'XL'] },
            { name: 'Solids: Black Cargo Pants', description: 'Comfortable black cargo pants', price: 1499, memberPrice: 1299, comparePrice: 1999, category: categoryMap['Joggers'], stock: 120, images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], featured: true, rating: 4.7, brand: 'The Souled Store', gender: 'Men', theme: 'Originals', sizes: ['30', '32', '34'] },
            { name: 'Friends: Central Perk', description: 'Official Friends Central Perk T-Shirt', price: 899, memberPrice: 799, comparePrice: 1199, category: categoryMap['T-Shirts'], stock: 0, images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], featured: false, rating: 4.6, brand: 'The Souled Store', gender: 'Women', theme: 'Originals', sizes: ['XS', 'S'] },
            { name: 'Harry Potter: Hogwarts Crest', description: 'Official Harry Potter T-Shirt', price: 799, memberPrice: 699, comparePrice: 999, category: categoryMap['T-Shirts'], stock: 32, images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], featured: true, rating: 4.8, brand: 'The Souled Store', gender: 'Unisex', theme: 'Harry Potter', sizes: ['S', 'M', 'L', 'XL'] }
        ]);

        console.log('✓ Products created');
        console.log('');
        console.log('✅ Database seeded successfully!');
        console.log('');
        console.log('NOTE: Admins can ONLY be created via this seed script.');
        console.log('      Users registering on the website are always customers.');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
