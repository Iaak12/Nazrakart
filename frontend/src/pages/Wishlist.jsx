import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { MdDelete, MdShoppingCart, MdFavoriteBorder, MdArrowForward } from 'react-icons/md';
import ProductCard from '../components/Products/ProductCard';

const Wishlist = () => {
    const { wishlist, toggleWishlist, loading } = useWishlist();
    const { formatPrice } = useCurrency();
    const { addToCart } = useCart();

    const filteredWishlist = wishlist.filter(p => p != null);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-tss-gray-200 border-t-tss-red rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-[70vh] pb-24">
            {/* Header */}
            <div className="bg-tss-gray-100 py-8 border-b border-tss-gray-200 mb-12">
                <div className="tss-container">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-tss-black uppercase tracking-[0.2em] flex items-center gap-3">
                                My Wishlist
                                <span className="text-tss-gray-400 text-sm font-bold tracking-widest mt-1">
                                    ({filteredWishlist.length} Items)
                                </span>
                            </h1>
                        </div>
                        <Link to="/shop" className="text-[11px] font-black text-tss-red uppercase tracking-widest hover:underline flex items-center gap-1">
                            Continue Shopping
                            <MdArrowForward size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="tss-container">
                {filteredWishlist.length === 0 ? (
                    <div className="max-w-md mx-auto text-center py-20 px-6 bg-tss-gray-50 rounded-sm border border-tss-gray-100">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <MdFavoriteBorder className="text-tss-gray-200" size={48} />
                        </div>
                        <h2 className="text-xl font-black text-tss-black mb-3 uppercase tracking-widest">Wishlist is empty</h2>
                        <p className="text-[12px] text-tss-gray-500 font-bold uppercase tracking-wider mb-10 leading-relaxed">
                            Looks like you haven't saved anything yet. <br />
                            Your favorite items will show up here.
                        </p>
                        <Link to="/shop" className="tss-button-primary inline-block w-full">EXPLORE PRODUCTS</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
                        {filteredWishlist.map(product => (
                            <div key={product._id} className="relative group">
                                <ProductCard product={product} />
                                {/* Optional: Explicit Remove from Wishlist button if the one on Card isn't enough for the user */}
                                <button
                                    onClick={() => toggleWishlist(product._id)}
                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-tss-red opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 scale-75 group-hover:scale-100"
                                    title="Remove from Wishlist"
                                >
                                    <MdDelete size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
