import React from 'react';
import { Link } from 'react-router-dom';
import DynamicHeading from '../DynamicHeading';

const CategoryCircles = ({ categories = [] }) => {
    const fallbackCategories = [
        { _id: 1, name: 'OVERSIZED T-SHIRTS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_4_gG3z8rS.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=oversized' },
        { _id: 2, name: 'CLASSIC T-SHIRTS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_ov_1_TqW7VbF.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=classic' },
        { _id: 3, name: 'CARGO PANTS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_ov_2_r4U0gWb.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=cargos' },
        { _id: 4, name: 'SNEAKERS', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_ov_3_f6GvH3s.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=sneakers' },
        { _id: 5, name: 'PERFUMES', image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/cat-circle_ov_4_k3L8MvP.jpg?format=webp&w=480&dpr=1.0', path: '/shop?category=perfumes' }
    ];

    const displayCategories = categories && categories.length > 0 ? categories : fallbackCategories;

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="tss-container">
                <div className="flex items-center mb-12">
                    <h2 className="text-xl md:text-2xl font-black text-tss-black tracking-widest uppercase">
                        SHOP BY CATEGORIES
                    </h2>
                </div>

                <div className="relative">
                    <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-6 snap-x">
                        {displayCategories.map((cat, index) => (
                            <Link
                                key={cat._id || index}
                                to={cat.path || `/shop?category=${cat.name.toLowerCase()}`}
                                className="flex flex-col items-center group min-w-[110px] md:min-w-[170px] snap-center"
                            >
                                <div className="relative w-[100px] h-[100px] md:w-[150px] md:h-[150px] mb-4">
                                    {/* Circle background effect */}
                                    <div className="absolute inset-0 bg-tss-gray-100 rounded-full group-hover:bg-tss-pink transition-colors duration-300"></div>

                                    {/* Image Container with elevation */}
                                    <div className="absolute inset-1 rounded-full overflow-hidden border-2 border-transparent group-hover:border-tss-red transition-all duration-300 transform group-hover:-translate-y-2 shadow-sm group-hover:shadow-xl">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                <DynamicHeading
                                    tag={cat.nameTag || 'span'}
                                    className="text-[10px] md:text-[12px] font-black text-tss-gray-500 group-hover:text-tss-red text-center uppercase tracking-widest leading-normal transition-colors duration-300"
                                >
                                    {cat.name}
                                </DynamicHeading>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryCircles;
