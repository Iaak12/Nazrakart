import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { MdDelete, MdShoppingCart, MdFavoriteBorder } from 'react-icons/md';

const Wishlist = () => {
    const { wishlist, toggleWishlist, loading } = useWishlist();
    const { formatPrice } = useCurrency();
    const { addToCart } = useCart();

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading wishlist...</div>;

    return (
        <div className="bg-white min-h-[60vh] pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-widest flex items-center justify-center gap-3">
                        <MdFavoriteBorder className="text-tss-red" />
                        My Wishlist
                    </h1>
                </div>

                {wishlist.filter(p => p != null).length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-12 lg:p-24 border border-gray-200">
                        <MdFavoriteBorder className="text-9xl text-gray-300 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your wishlist yet. Explore our products and add your favorites!</p>
                        <Link to="/shop" className="px-8 py-4 bg-tss-red text-white uppercase font-bold tracking-widest rounded-md hover:bg-black transition-colors shadow-lg">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlist.filter(p => p != null).map(product => (
                            <div key={product._id} className="group flex flex-col bg-white overflow-hidden relative border border-gray-100 rounded-lg hover:shadow-xl transition-shadow duration-300">

                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/400x533'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <button
                                        onClick={() => toggleWishlist(product._id)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-tss-red hover:bg-red-50 transition-colors z-10"
                                        title="Remove from Wishlist"
                                    >
                                        <MdDelete size={20} />
                                    </button>

                                    {/* Quick Add Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 bg-gradient-to-t from-black/60 to-transparent">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(product, 1, product.variations?.[0]?.size || 'S');
                                            }}
                                            className="w-full py-3 bg-white text-gray-900 font-bold uppercase tracking-wider text-sm hover:bg-tss-red hover:text-white transition-colors flex items-center justify-center gap-2 rounded-md"
                                        >
                                            <MdShoppingCart />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>

                                <Link to={`/product/${product._id}`} className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 line-clamp-2 uppercase tracking-wide group-hover:text-tss-red transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="font-semibold text-gray-500 text-sm mt-auto mt-2">
                                        {formatPrice(product.price)}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
