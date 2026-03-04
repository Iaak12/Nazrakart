import React from 'react';
import { Link } from 'react-router-dom';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
    const { formatPrice } = useCurrency();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product._id);

    // Fallback images if product doesn't have them
    const mainImage = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/400x500?text=Product+Image';

    const hoverImg = product.hoverImage || (product.images && product.images.length > 1
        ? product.images[1]
        : mainImage);

    return (
        <div className="group relative flex flex-col bg-white">
            {/* Image Container */}
            <Link to={`/product/${product._id}`} className="relative block overflow-hidden aspect-[4/5] bg-gray-100">
                {/* Main Image */}
                <img
                    src={mainImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                />
                {/* Hover Image */}
                <img
                    src={hoverImg}
                    alt={`${product.name} alternate view`}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.theme && (
                        <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider backdrop-blur-sm">
                            {product.theme}
                        </span>
                    )}
                    {product.featured && (
                        <span className="bg-tss-red/90 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider backdrop-blur-sm shadow-sm">
                            Bestseller
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    className={`absolute top-2 right-2 p-2 bg-white/50 backdrop-blur-sm rounded-full transition-all duration-300 z-10 active:scale-90
                    ${isWishlisted ? 'text-tss-red opacity-100 scale-110' : 'text-gray-600 hover:text-tss-red hover:bg-white opacity-0 group-hover:opacity-100 hover:scale-110'}`}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product._id);
                    }}
                >
                    {isWishlisted ? <MdFavorite size={20} className="animate-[ping_0.3s_cubic-bezier(0,0,0.2,1)_1]" /> : <MdFavoriteBorder size={20} />}
                </button>

                {/* Size Preview Slide Up on Hover */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out border-t border-gray-100 z-10">
                        <div className="p-2">
                            <p className="text-[10px] text-center text-gray-500 font-medium mb-1 uppercase tracking-wider">Sizes Available</p>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {product.sizes.map(size => (
                                    <span key={size} className="text-xs font-bold text-gray-800 border border-gray-300 rounded-sm min-w-[24px] text-center px-1 py-0.5 hover:border-tss-red hover:text-tss-red cursor-pointer transition-colors bg-white">
                                        {size}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Link>

            {/* Product Details */}
            <div className="pt-3 pb-2 flex flex-col flex-1 px-1 text-left">
                {/* Product Name */}
                <Link to={`/product/${product._id}`} className="text-[14px] font-bold text-tss-black line-clamp-1 hover:text-tss-red transition-colors uppercase font-ubuntu tracking-tight">
                    {product.name}
                </Link>

                {/* Category/Subtitle */}
                <p className="text-[12px] text-tss-dark-gray font-medium mb-2 capitalize">
                    {product.gender === 'Unisex' ? '' : `${product.gender} `}{product.category?.name || 'Apparel'}
                </p>

                <div className="mt-auto space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                        <span className="font-bold text-tss-black">
                            {formatPrice(product.price)}
                        </span>
                        {product.comparePrice > product.price && (
                            <span className="text-gray-400 line-through">
                                {formatPrice(product.comparePrice)}
                            </span>
                        )}
                        {product.comparePrice > product.price && (
                            <span className="text-[#117a7a] font-bold">
                                {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                            </span>
                        )}
                    </div>

                    {/* Member Price (TSS Super Squad style) */}
                    {product.memberPrice > 0 && product.memberPrice < product.price && (
                        <div className="text-[12px] font-bold text-[#117a7a] flex items-center gap-1 mt-1">
                            <span className="text-xs">₹</span>
                            {product.memberPrice} <span className="text-gray-500 font-medium text-[11px]">For TriBe Members</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
