import React from 'react';
import { Link } from 'react-router-dom';
import { MdFavoriteBorder, MdFavorite, MdFlashOn } from 'react-icons/md';
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
        <div className="group relative flex flex-col bg-white overflow-hidden">
            {/* Image Container with precise TSS aspects */}
            <div className="relative aspect-[4/5] bg-tss-gray-100 overflow-hidden rounded-sm">
                <Link to={`/product/${product._id}`} className="block w-full h-full">
                    {/* Main Image */}
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                        loading="lazy"
                    />
                    {/* Hover Image Swap */}
                    <img
                        src={hoverImg}
                        alt={`${product.name} alternate view`}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                    />
                </Link>

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 pointer-events-none">
                    {product.theme && (
                        <span className="bg-white/95 text-tss-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-sm">
                            {product.theme}
                        </span>
                    )}
                    {product.featured && (
                        <span className="bg-tss-red text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-md">
                            MUST HAVE
                        </span>
                    )}
                </div>

                {/* Wishlist Button - Corner Style */}
                <button
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 z-10 
                    ${isWishlisted
                            ? 'bg-tss-red text-white shadow-lg scale-110'
                            : 'bg-white/70 text-tss-black hover:bg-white hover:text-tss-red opacity-0 group-hover:opacity-100 shadow-sm hover:scale-110'}`}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product._id);
                    }}
                >
                    {isWishlisted ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
                </button>

                {/* Quick Add Sizes - Slide Up */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-3 border-t border-tss-gray-100 hidden md:block">
                        <p className="text-[9px] text-center text-tss-gray-500 font-black mb-2 uppercase tracking-widest">Select Size</p>
                        <div className="flex justify-center gap-2 flex-wrap">
                            {product.sizes.slice(0, 5).map(size => (
                                <button key={size} className="text-[10px] font-black text-tss-black border border-tss-gray-200 rounded-sm w-8 h-8 flex items-center justify-center hover:border-tss-red hover:text-tss-red transition-all active:scale-95 bg-white">
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Details - TSS Typography */}
            <div className="pt-4 pb-2 text-left">
                <h3 className="text-[13px] font-black text-tss-black truncate mb-0.5 uppercase tracking-tight group-hover:text-tss-red transition-colors">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                </h3>

                <p className="text-[11px] text-tss-gray-500 font-bold mb-3 uppercase tracking-wider">
                    {product.gender === 'Unisex' ? '' : `${product.gender} `}{product.category?.name || 'Apparel'}
                </p>

                <div className="flex flex-col gap-1 mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] font-black text-tss-black">
                            {formatPrice(product.price)}
                        </span>
                        {product.comparePrice > product.price && (
                            <span className="text-[12px] text-tss-gray-400 line-through font-bold">
                                {formatPrice(product.comparePrice)}
                            </span>
                        )}
                        {product.comparePrice > product.price && (
                            <span className="text-tss-red text-[11px] font-black tracking-tighter">
                                ({Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF)
                            </span>
                        )}
                    </div>

                    {/* TriBe Member Price */}
                    <div className="tss-badge-tribe w-max mt-1">
                        <MdFlashOn size={10} />
                        <span>₹{product.memberPrice || Math.round(product.price * 0.9)} <span className="opacity-70 text-[8px] font-bold">For TriBe Members</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
