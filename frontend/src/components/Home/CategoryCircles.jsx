import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCircles = ({ categories = [] }) => {
    // These should ideally come from backend categories
    const fallbackCategories = [
        { _id: 1, name: 'OVERSIZED T-SHIRTS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_4_gG3z8rS.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=oversized' }
    ];

    const displayCategories = categories && categories.length > 0 ? categories : fallbackCategories;

    return (
        <div className="py-8 bg-white">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8 uppercase tracking-widest">
                CATEGORIES
            </h2>

            <div className="max-w-7xl mx-auto px-4">
                {/* Scrollable Container */}
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex gap-6 md:justify-center min-w-max">
                        {displayCategories.map((cat, index) => (
                            <Link
                                key={cat._id || index}
                                to={cat.path}
                                className="flex flex-col items-center group w-[120px] md:w-[150px]"
                            >
                                <div className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden transition-all duration-300">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                                <span className="mt-4 text-[12px] md:text-[14px] font-bold text-center text-gray-800 group-hover:text-tss-red px-2 leading-tight uppercase transition-colors font-roboto">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            {/* Global style for hiding scrollbar added here purely as inline style equivalent for easy pasting */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default CategoryCircles;
