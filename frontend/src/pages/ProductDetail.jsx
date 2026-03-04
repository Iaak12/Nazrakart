import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MdShoppingCart, MdAdd, MdRemove, MdStar, MdLocalShipping, MdVerified, MdArrowBack, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = product ? isInWishlist(product._id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setProduct(data);
                } else {
                    setProduct(null);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error('Please select a size', {
                style: {
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }

        addToCart({ ...product, selectedSize }, quantity);
        toast.success('Added to Cart!', {
            icon: '🛒',
            style: {
                borderRadius: '8px',
                background: '#117a7a',
                color: '#fff',
            },
        });
    };

    const handleBuyNow = () => {
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error('Please select a size', {
                style: {
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }

        addToCart({ ...product, selectedSize }, quantity);
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <Link to="/shop" className="text-gray-600 hover:text-gray-900">Back to Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
                <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-tss-red mb-8 transition-colors text-sm font-medium uppercase tracking-wider">
                    <MdArrowBack size={18} />
                    Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            {/* Thumbnails (Vertical on LG) */}
                            {product.images.length > 1 && (
                                <div className="hidden lg:flex flex-col gap-4">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`w-20 h-24 overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-tss-red' : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div className="aspect-[4/5] flex-1 overflow-hidden bg-gray-50">
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Mobile Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex lg:hidden gap-4 mt-4 overflow-x-auto pb-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-16 h-20 flex-shrink-0 overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-tss-red' : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{product.name.toLowerCase()}</h1>
                            <p className="text-gray-500 text-sm font-medium mb-4">{product.theme ? `${product.theme} MERCHANDISE` : product.category}</p>

                            {/* Price Section */}
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                                {product.comparePrice > product.price && (
                                    <span className="text-lg text-gray-400 line-through">₹{product.comparePrice}</span>
                                )}
                                {product.comparePrice > product.price && (
                                    <span className="text-sm text-tss-success font-bold mb-1">
                                        {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mb-4">MRP incl. of all taxes</p>

                            {/* Member Price */}
                            {product.memberPrice && (
                                <div className="bg-[#f2f8f8] border border-[#d6eeee] rounded-sm p-3 mb-4 flex items-center gap-2">
                                    <span className="font-bold text-[#117a7a] text-lg">₹{product.memberPrice}</span>
                                    <span className="text-[#117a7a] text-sm">For TriBe Members</span>
                                </div>
                            )}
                        </div>

                        {/* Size Selector */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="py-4 border-b border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900">Please Select a Size</h3>
                                    <button className="text-tss-red text-sm font-bold uppercase tracking-wider hover:underline">Size Guide</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 flex items-center justify-center border font-bold text-sm transition-all ${selectedSize === size
                                                ? 'border-tss-red text-tss-red bg-white shadow-md'
                                                : 'border-gray-300 text-gray-700 bg-white hover:border-gray-400'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6 py-4">
                            <span className="text-gray-900 font-bold uppercase tracking-wider text-sm">Qty:</span>
                            <div className="flex items-center border border-gray-300 rounded-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 text-gray-500 hover:text-tss-red transition-colors"
                                >
                                    <MdRemove size={18} />
                                </button>
                                <span className="w-10 text-center text-gray-900 font-bold ">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="p-2 text-gray-500 hover:text-tss-red transition-colors"
                                >
                                    <MdAdd size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 py-4 bg-white border border-gray-900 text-gray-900 rounded-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 flex items-center justify-center gap-3 py-4 bg-tss-red text-white rounded-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MdShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button
                                onClick={() => toggleWishlist(product._id)}
                                className={`w-14 h-14 flex flex-shrink-0 items-center justify-center rounded-sm border transition-all active:scale-90 ${isWishlisted ? 'border-tss-red text-tss-red bg-red-50 hover:bg-red-100' : 'border-gray-300 text-gray-500 hover:text-tss-red hover:border-tss-red hover:bg-gray-50'
                                    }`}
                                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                {isWishlisted ? <MdFavorite size={24} className="animate-[ping_0.3s_cubic-bezier(0,0,0.2,1)_1]" /> : <MdFavoriteBorder size={24} />}
                            </button>
                        </div>

                        {/* Description */}
                        <div className="pt-6">
                            <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide">Product Details</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                                <MdLocalShipping className="text-gray-400" size={24} />
                                <div>
                                    <p className="text-gray-900 text-xs font-bold uppercase">Estimated Delivery</p>
                                    <p className="text-gray-500 text-xs">3-5 Working Days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdVerified className="text-gray-400" size={24} />
                                <div>
                                    <p className="text-gray-900 text-xs font-bold uppercase">Genuine Product</p>
                                    <p className="text-gray-500 text-xs">100% Guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
