import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const HeroCarousel = ({ banners = [] }) => {
    const fallbackBanners = [
        {
            _id: 1,
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Homepage-Banner_7_R5uTbdT.jpg?format=webp&w=1500&dpr=1.0',
            mobileImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Hompage-Banner_3_b6e4Fto.jpg?format=webp&w=480&dpr=1.0',
            link: '/shop?theme=Marvel',
            alt: 'Marvel Official Merchandise'
        }
    ];

    const displayBanners = banners && banners.length > 0 ? banners : fallbackBanners;

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [displayBanners.length]);

    const nextSlide = () => setCurrentSlide(prev => prev === displayBanners.length - 1 ? 0 : prev + 1);
    const prevSlide = () => setCurrentSlide(prev => prev === 0 ? displayBanners.length - 1 : prev - 1);

    return (
        <div className="relative w-full overflow-hidden group">
            {/* Aspect Ratio Container: 2.5:1 Desktop, 1:1.2 Mobile roughly */}
            <div className="relative w-full pb-[120%] md:pb-[40%]">
                {displayBanners.map((banner, index) => (
                    <Link
                        key={banner._id || index}
                        to={banner.link}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {/* Desktop Image */}
                        <img
                            src={banner.image}
                            alt={banner.alt}
                            className="hidden md:block w-full h-full object-cover"
                        />
                        {/* Mobile Image */}
                        <img
                            src={banner.mobileImage}
                            alt={banner.alt}
                            className="md:hidden w-full h-full object-cover"
                        />
                    </Link>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
            >
                <MdChevronLeft size={36} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
            >
                <MdChevronRight size={36} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {displayBanners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 ${index === currentSlide ? 'w-8 h-[3px] bg-white' : 'w-4 h-[3px] bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
