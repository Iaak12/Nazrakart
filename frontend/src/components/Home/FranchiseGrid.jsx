import React from 'react';
import { Link } from 'react-router-dom';

const FranchiseGrid = ({ franchises = [] }) => {
    const fallbackFranchises = [
        {
            _id: 1,
            name: 'Marvel',
            image: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/product-images/Marvel_Logo_xGpJx8s.jpg?format=webp&w=480&dpr=1.0',
            bgImage: 'https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/franchise-bg-marvel_mD2f1K.jpg?format=webp&w=480&dpr=1.0',
            path: '/shop?theme=Marvel',
            color: 'from-red-900 to-red-600'
        }
    ];

    const displayFranchises = franchises && franchises.length > 0 ? franchises : fallbackFranchises;

    return (
        <div className="py-12 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-widest uppercase mb-2 font-ubuntu">
                        Official Merchandise
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {displayFranchises.map((franchise, index) => (
                        <Link
                            key={franchise._id || index}
                            to={franchise.path}
                            className={`relative group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/5] flex items-center justify-center bg-gradient-to-br ${franchise.color} bg-opacity-90`}
                        >
                            {/* Optional Background Image Filtered */}
                            {franchise.bgImage && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                                    style={{ backgroundImage: `url(${franchise.bgImage})` }}
                                />
                            )}

                            {/* Logo/Name */}
                            <div className="relative z-10 p-4 transform group-hover:-translate-y-2 transition-transform duration-500 w-full h-full flex items-center justify-center">
                                {franchise.image ? (
                                    <div className="w-3/4 aspect-square bg-transparent flex items-center justify-center">
                                        <img src={franchise.image} alt={franchise.name} className="w-full h-full object-contain filter drop-shadow-lg" />
                                    </div>
                                ) : (
                                    <h3 className="text-2xl md:text-3xl font-black text-white text-center uppercase tracking-widest drop-shadow-md font-ubuntu">
                                        {franchise.name}
                                    </h3>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FranchiseGrid;
