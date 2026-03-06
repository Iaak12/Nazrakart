import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/Home/HeroCarousel';
import CategoryCircles from '../components/Home/CategoryCircles';
import FranchiseGrid from '../components/Home/FranchiseGrid';
import ProductCard from '../components/Products/ProductCard';
import SEO from '../components/SEO';
import { MdFlashOn } from 'react-icons/md';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [homeData, setHomeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                // Fetch dynamic Home data (Banners, Categories, Franchises)
                const homeRes = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
                if (homeRes.ok) {
                    const data = await homeRes.json();
                    setHomeData(data);
                }

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
                        sizes: ['S', 'M', 'L', 'XL'],
                        featured: true
                    },
                    {
                        _id: '2',
                        name: 'Batman: The Dark Knight',
                        category: { name: 'Classic Fit' },
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
                        sizes: ['30', '32', '34', '36'],
                        featured: true
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
                    {
                        _id: '5',
                        name: 'Mickey Mouse Classic',
                        category: { name: 'Oversized T-Shirts' },
                        price: 1099,
                        comparePrice: 1499,
                        memberPrice: 999,
                        images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'],
                        hoverImage: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0',
                        theme: 'Disney',
                        gender: 'Unisex',
                        sizes: ['S', 'M', 'L']
                    },
                    {
                        _id: '6',
                        name: 'Space Jam: Squad',
                        category: { name: 'Classic Fit' },
                        price: 899,
                        comparePrice: 1099,
                        memberPrice: 799,
                        images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'],
                        hoverImage: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0',
                        theme: 'Looney Tunes',
                        gender: 'Men',
                        sizes: ['M', 'L', 'XL']
                    },
                    {
                        _id: '7',
                        name: 'Harry Potter: Hogwarts',
                        category: { name: 'Hoodies' },
                        price: 1999,
                        comparePrice: 2499,
                        memberPrice: 1799,
                        images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'],
                        hoverImage: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0',
                        theme: 'Harry Potter',
                        gender: 'Unisex',
                        sizes: ['S', 'M', 'L', 'XL']
                    },
                    {
                        _id: '8',
                        name: 'Naruto: Akatsuki',
                        category: { name: 'Anime T-Shirts' },
                        price: 1199,
                        comparePrice: 1599,
                        memberPrice: 1099,
                        images: ['https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0'],
                        hoverImage: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0',
                        theme: 'Naruto',
                        gender: 'Men',
                        sizes: ['M', 'L', 'XL']
                    }
                ]);

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
            <SEO pageName="home" />

            <HeroCarousel banners={homeData?.banners} />

            <CategoryCircles categories={homeData?.categories} />

            {/* TriBe Promotional Banner */}
            <div className="bg-[#e1f5f5] py-4 my-8 mx-4 md:mx-auto tss-container rounded-sm flex flex-col md:flex-row items-center justify-between px-8 gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-tss-green text-white rounded-full">
                        <MdFlashOn size={24} />
                    </div>
                    <div>
                        <h3 className="text-tss-green text-lg font-black tracking-widest">BECOME A TRIBE MEMBER</h3>
                        <p className="text-[10px] text-tss-gray-500 font-bold tracking-widest uppercase">Get extra discounts and early access to drops</p>
                    </div>
                </div>
                <Link to="/membership" className="tss-button-primary !bg-tss-green hover:!bg-[#0d6161] !py-2.5 !text-[10px]">
                    JOIN NOW
                </Link>
            </div>

            <FranchiseGrid franchises={homeData?.franchises} />

            {/* New Arrivals Section */}
            <section className="py-20 bg-white">
                <div className="tss-container">
                    <div className="flex items-center mb-12">
                        <h2 className="text-xl md:text-2xl font-black text-tss-black tracking-widest uppercase">
                            NEW ARRIVALS
                        </h2>
                        <div className="flex-1"></div>
                        <Link to="/shop" className="text-[11px] font-black text-tss-red hover:underline tracking-widest uppercase whitespace-nowrap">
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tss-red"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                            {featuredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Final CTA */}
            <div className="bg-tss-black py-20 text-center text-white">
                <div className="tss-container">
                    <h2 className="text-4xl font-black tracking-tighter italic mb-6">NAZRAKART SOCIAL</h2>
                    <p className="text-xs font-bold text-white/50 tracking-[0.3em] uppercase mb-10">Tag us in your fits to get featured</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/shop" className="tss-button-primary">SHOP THE FEED</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
