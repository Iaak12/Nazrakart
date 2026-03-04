import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

const mockProducts = [
    { name: 'Marvel: Spider-Man Logo View', description: '100% Cotton, bio-washed', price: 999, comparePrice: 1299, memberPrice: 899, theme: 'Marvel', categoryName: 'T-Shirts', gender: 'Men', sizes: ['S', 'M', 'L'], images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], stock: 100, rating: 4.8 },
    { name: 'Batman: The Dark Knight', description: 'Classic fit tee', price: 799, comparePrice: 999, memberPrice: 699, theme: 'DC', categoryName: 'T-Shirts', gender: 'Unisex', sizes: ['M', 'L', 'XL'], images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], stock: 100, rating: 4.9 },
    { name: 'Solids: Black Cargo Pants', description: 'Comfortable cargo', price: 1499, comparePrice: 1999, memberPrice: 1299, theme: 'Originals', categoryName: 'Joggers', gender: 'Men', sizes: ['S', 'M', 'L'], images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], stock: 100, rating: 4.7 },
    { name: 'Friends: Central Perk', description: 'Women tee', price: 899, comparePrice: 1199, memberPrice: 799, theme: 'Originals', categoryName: 'T-Shirts', gender: 'Women', sizes: ['XS', 'S', 'M'], images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], stock: 100, rating: 4.6 },
    { name: 'Harry Potter: Hogwarts Crest', description: 'Harry potter tee', price: 1099, comparePrice: 1299, memberPrice: 899, theme: 'Harry Potter', categoryName: 'T-Shirts', gender: 'Unisex', sizes: ['S', 'M', 'L', 'XL'], images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], stock: 100, rating: 4.8 },
    { name: 'Originals: Navy Blue Shirt', description: 'Blue shirt', price: 1299, comparePrice: 1599, memberPrice: 1099, theme: 'Originals', categoryName: 'Shirts', gender: 'Men', sizes: ['M', 'L', 'XL', 'XXL'], images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'], stock: 100, rating: 4.5 }
];

const seedDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/nazrakart');
        console.log('MongoDB Connected');

        await Product.deleteMany();

        let categoriesMap = {};
        for (const p of mockProducts) {
            if (!categoriesMap[p.categoryName]) {
                let cat = await Category.findOne({ name: p.categoryName });
                if (!cat) {
                    cat = await Category.create({ name: p.categoryName, slug: p.categoryName.toLowerCase() });
                }
                categoriesMap[p.categoryName] = cat._id;
            }

            p.category = categoriesMap[p.categoryName];
            delete p.categoryName;
        }

        await Product.insertMany(mockProducts);
        console.log('Database seeded with mock products!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedDB();
