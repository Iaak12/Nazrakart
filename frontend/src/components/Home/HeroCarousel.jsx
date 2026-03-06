import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import DynamicHeading from '../DynamicHeading';

const HeroCarousel = ({ banners = [] }) => {
    const fallbackBanners = [
        {
            _id: 'fb1',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Homepage-Banner_7_R5uTbdT.jpg?format=webp&w=1500&dpr=1.0',
            mobileImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Hompage-Banner_3_b6e4Fto.jpg?format=webp&w=480&dpr=1.0',
            link: '/shop?theme=Marvel',
            alt: 'Marvel Official Merchandise'
        },
        {
            _id: 'fb2',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Homepage-banner-generic.jpg?format=webp&w=1500&dpr=1.0',
            mobileImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/mobile-banner-generic.jpg?format=webp&w=480&dpr=1.0',
            link: '/shop',
            alt: 'New Arrivals'
        }
    ];

    const displayBanners = banners && banners.length > 0 ? banners : fallbackBanners;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
    }, [displayBanners.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, isHovered]);

    return (
        <section
            className="relative w-full overflow-hidden bg-tss-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Aspect Ratio Container: optimized for TSS look */}
            <div className="relative w-full aspect-[16/19] md:aspect-[2.8/1] overflow-hidden">
                {displayBanners.map((banner, index) => (
                    <div
                        key={banner._id || index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide
                            ? 'opacity-100 scale-100 z-10'
                            : 'opacity-0 scale-105 z-0'
                            }`}
                    >
                        <Link to={banner.link} className="block w-full h-full relative">
                            {/* Desktop Image */}
                            <img
                                src={banner.image}
                                alt={banner.alt}
                                className="hidden md:block w-full h-full object-cover"
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                            {/* Mobile Image */}
                            <img
                                src={banner.mobileImage || banner.image}
                                alt={banner.alt}
                                className="md:hidden w-full h-full object-cover"
                            />
                            {/* Banner Title Overlay (if provided) */}
                            {banner.title && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                    <DynamicHeading
                                        tag={banner.titleTag || 'h2'}
                                        className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter italic drop-shadow-lg"
                                    >
                                        {banner.title}
                                    </DynamicHeading>
                                </div>
                            )}
                        </Link>
                    </div>
                ))}

                {/* Left/Right Overlays for Gradient Hint */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/10 to-transparent z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/10 to-transparent z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Navigation Arrows - Premium Styling */}
            <div className="absolute inset-0 flex items-center justify-between px-4 z-30 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="pointer-events-auto h-12 w-12 flex items-center justify-center bg-white/90 hover:bg-tss-red hover:text-white text-tss-black rounded-full shadow-xl transition-all duration-300 -translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                >
                    <MdChevronLeft size={32} />
                </button>
                <button
                    onClick={nextSlide}
                    className="pointer-events-auto h-12 w-12 flex items-center justify-center bg-white/90 hover:bg-tss-red hover:text-white text-tss-black rounded-full shadow-xl transition-all duration-300 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                >
                    <MdChevronRight size={32} />
                </button>
            </div>

            {/* Pagination Dots - TSS Bar Style */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center gap-3">
                {displayBanners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-500 ease-out h-[3px] rounded-full ${index === currentSlide
                            ? 'w-10 bg-tss-red'
                            : 'w-4 bg-white/40 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;
