import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/Home/HeroCarousel';
import CategoryCircles from '../components/Home/CategoryCircles';
import FranchiseGrid from '../components/Home/FranchiseGrid';
import ProductCard from '../components/Products/ProductCard';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [homeData, setHomeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                // In a real app, you'd fetch featured products from the backend
                // const res = await axios.get('/api/products?featured=true&limit=4');
                // setFeaturedProducts(res.data.products);

                // Mock data for demo purposes since we don't know the DB state
                setFeaturedProducts([
                    {
                        _id: '1',
                        name: 'Marvel: Spider-Man Logo View',
                        category: { name: 'Oversized T-Shirts' },
                        price: 999,
                        comparePrice: 1299,
                        memberPrice: 899,
                        images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'],
                        hoverImage: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0',
                        theme: 'Marvel',
                        gender: 'Men',
                        sizes: ['S', 'M', 'L', 'XL']
                    },
                    {
                        _id: '2',
                        name: 'Batman: The Dark Knight',
                        category: { name: 'Classic Fit ' },
                        price: 799,
                        comparePrice: 999,
                        memberPrice: 699,
                        images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'],
                        hoverImage: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0',
                        theme: 'DC',
                        gender: 'Unisex',
                        sizes: ['M', 'L', 'XL']
                    },
                    {
                        _id: '3',
                        name: 'Solids: Black Cargo Pants',
                        category: { name: 'Cargos' },
                        price: 1499,
                        comparePrice: 1999,
                        memberPrice: 1299,
                        images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'],
                        hoverImage: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0',
                        theme: 'Originals',
                        gender: 'Men',
                        sizes: ['30', '32', '34', '36']
                    },
                    {
                        _id: '4',
                        name: 'Friends: Central Perk',
                        category: { name: 'Women T-Shirts' },
                        price: 899,
                        comparePrice: 1199,
                        memberPrice: 799,
                        images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'],
                        hoverImage: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0',
                        theme: 'Friends',
                        gender: 'Women',
                        sizes: ['XS', 'S', 'M', 'L']
                    },
                ]);

                // Fetch dynamic Home data (Banners, Categories, Franchises)
                const homeRes = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
                if (homeRes.ok) {
                    const data = await homeRes.json();
                    setHomeData(data);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching featured products", error);
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <HeroCarousel banners={homeData?.banners} />
            <CategoryCircles categories={homeData?.categories} />
            <FranchiseGrid franchises={homeData?.franchises} />

            {/* Featured Products Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-widest uppercase">
                            New Arrivals
                        </h2>
                        <div className="w-24 h-1 bg-tss-red mx-auto mt-4"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tss-red"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {featuredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link
                            to="/shop"
                            className="inline-block border-2 border-tss-red text-tss-red font-bold py-3 px-8 uppercase tracking-widest hover:bg-tss-red hover:text-white transition-colors duration-300"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
