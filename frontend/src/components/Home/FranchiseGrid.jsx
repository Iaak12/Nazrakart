import React from 'react';
import { Link } from 'react-router-dom';

const FranchiseGrid = ({ franchises = [] }) => {
    const fallbackFranchises = [
        {
            _id: 'f1',
            name: 'Marvel',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/Marvel_Logo_xGpJx8s.jpg?format=webp&w=480&dpr=1.0',
            bgImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/franchise-bg-marvel_mD2f1K.jpg?format=webp&w=480&dpr=1.0',
            path: '/shop?theme=Marvel',
            color: 'bg-[#ed1d24]'
        },
        {
            _id: 'f2',
            name: 'DC Comics',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/DC_Logo_78L8MvP.jpg?format=webp&w=480&dpr=1.0',
            bgImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/franchise-bg-dc_k3L8MvP.jpg?format=webp&w=480&dpr=1.0',
            path: '/shop?theme=DC',
            color: 'bg-[#0476F2]'
        },
        {
            _id: 'f3',
            name: 'Harry Potter',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/HP_Logo_t6uTbdT.jpg?format=webp&w=480&dpr=1.0',
            bgImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/franchise-bg-hp_r4U0gWb.jpg?format=webp&w=480&dpr=1.0',
            path: '/shop?theme=Harry+Potter',
            color: 'bg-[#0E1B40]'
        },
        {
            _id: 'f4',
            name: 'Disney',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/Disney_Logo_mD2f1K.jpg?format=webp&w=480&dpr=1.0',
            bgImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/franchise-bg-disney_b6e4Fto.jpg?format=webp&w=480&dpr=1.0',
            path: '/shop?theme=Disney',
            color: 'bg-[#1D1D1D]'
        }
    ];

    const displayFranchises = franchises && franchises.length > 0 ? franchises : fallbackFranchises;

    return (
        <section className="py-16 bg-white">
            <div className="tss-container">
                <div className="flex items-center mb-10">
                    <h2 className="text-xl md:text-2xl font-black text-tss-black tracking-widest uppercase">
                        OFFICIAL MERCHANDISE
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {displayFranchises.map((franchise, index) => (
                        <Link
                            key={franchise._id || index}
                            to={franchise.path}
                            className={`relative group overflow-hidden transition-all duration-500 aspect-[4/5] rounded-sm shadow-sm hover:shadow-2xl ${franchise.color || 'bg-tss-black'}`}
                        >
                            {/* Background Image with Overlay */}
                            {franchise.bgImage && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
                                    style={{ backgroundImage: `url(${franchise.bgImage})` }}
                                />
                            )}

                            {/* Gradient Overlay for logo contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Logo/Content */}
                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-4/5 transform group-hover:-translate-y-4 transition-transform duration-500">
                                    <img
                                        src={franchise.image}
                                        alt={franchise.name}
                                        className="w-full h-auto object-contain filter drop-shadow-2xl"
                                    />
                                </div>
                                <div className="absolute bottom-6 left-0 right-0 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex justify-center">
                                    <span className="text-[10px] font-black text-white border border-white/40 px-3 py-1 bg-white/10 backdrop-blur-sm tracking-[0.2em] uppercase">
                                        Shop Now
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FranchiseGrid;
