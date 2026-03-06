import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MdShoppingCart, MdAdd, MdRemove, MdStar, MdLocalShipping, MdVerified, MdArrowBack, MdFavoriteBorder, MdFavorite, MdFlashOn, MdSecurity, MdCached } from 'react-icons/md';
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
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error('Please select a size', {
                style: { borderRadius: '4px', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' },
            });
            return;
        }

        addToCart({ ...product, selectedSize }, quantity);
        toast.success('Successfully added to cart!', {
            icon: '🛒',
            style: { borderRadius: '4px', background: '#117a7a', color: '#fff', fontSize: '12px', fontWeight: 'bold' },
        });
    };

    const handleBuyNow = () => {
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }

        addToCart({ ...product, selectedSize }, quantity);
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-tss-gray-200 border-t-tss-red rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-tss-black mb-6 uppercase tracking-widest">Product not found</h2>
                    <Link to="/shop" className="tss-button-primary">Back to Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Breadcrumb Area */}
            <div className="bg-tss-gray-100 py-3 border-b border-tss-gray-200">
                <div className="tss-container">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-tss-gray-500 uppercase tracking-widest">
                        <Link to="/" className="hover:text-tss-red">Home</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:text-tss-red">Shop</Link>
                        <span>/</span>
                        <span className="text-tss-black truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="tss-container py-10">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                    {/* Left: Sticky Image Gallery */}
                    <div className="flex-1 lg:sticky lg:top-32 self-start">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Thumbnails */}
                            <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[600px]">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all duration-300 ${selectedImage === index ? 'border-tss-red shadow-md scale-105' : 'border-tss-gray-100 hover:border-tss-gray-300'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image View */}
                            <div className="order-1 md:order-2 flex-1 relative aspect-[4/5] bg-tss-gray-100 rounded-sm overflow-hidden group">
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                {/* Zoom Icon Overlay */}
                                <div className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MdArrowBack className="rotate-180" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex-1 space-y-8">
                        <div className="border-b border-tss-gray-100 pb-8">
                            <h1 className="text-2xl md:text-3xl font-black text-tss-black mb-2 uppercase tracking-tight leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <p className="text-[11px] text-tss-gray-500 font-bold tracking-[0.2em] uppercase">
                                    {product.theme ? `${product.theme} Official Merchandise` : product.category?.name || 'Apparel'}
                                </p>
                                <div className="h-4 w-px bg-tss-gray-200"></div>
                                <div className="flex items-center gap-1">
                                    <MdStar className="text-[#FFB400]" size={16} />
                                    <span className="text-[12px] font-black text-tss-black">4.8</span>
                                    <span className="text-[10px] text-tss-gray-400 font-bold">(1.2k Reviews)</span>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-3xl font-black text-tss-black">
                                    {formatPrice(product.price)}
                                </span>
                                {product.comparePrice > product.price && (
                                    <span className="text-lg text-tss-gray-400 line-through font-bold">
                                        {formatPrice(product.comparePrice)}
                                    </span>
                                )}
                                {product.comparePrice > product.price && (
                                    <span className="text-tss-red text-[13px] font-black tracking-widest uppercase">
                                        {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-tss-gray-400 font-bold uppercase tracking-wider mb-6">Inclusive of all taxes</p>

                            {/* TriBe Member Price Highlight */}
                            <div className="bg-[#e1f5f5] border border-[#b2e5e5] rounded-sm p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-tss-green text-white rounded-full">
                                        <MdFlashOn size={18} />
                                    </div>
                                    <div>
                                        <p className="text-tss-green text-[14px] font-black">
                                            {formatPrice(product.memberPrice || Math.round(product.price * 0.9))}
                                        </p>
                                        <p className="text-[10px] text-[#0d6161] font-bold uppercase tracking-wider">For TriBe Members</p>
                                    </div>
                                </div>
                                <Link to="/membership" className="text-[10px] font-black text-tss-green hover:underline tracking-widest">BECOME MEMBER</Link>
                            </div>
                        </div>

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[12px] font-black text-tss-black uppercase tracking-widest">Select Size</h4>
                                    <button className="text-[10px] font-black text-tss-red uppercase tracking-widest hover:underline">Size Guide</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-14 h-14 flex items-center justify-center border-2 font-black text-[13px] transition-all rounded-sm
                                                ${selectedSize === size
                                                    ? 'border-tss-red text-tss-red bg-white shadow-lg scale-110'
                                                    : 'border-tss-gray-100 text-tss-black bg-white hover:border-tss-gray-300'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Actions */}
                        <div className="pt-4 space-y-6">
                            <div className="flex items-center gap-6">
                                <span className="text-[12px] font-black text-tss-black uppercase tracking-widest">Quantity</span>
                                <div className="flex items-center border-2 border-tss-gray-100 rounded-sm bg-tss-gray-50">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 text-tss-gray-500 hover:text-tss-red transition-colors"
                                    >
                                        <MdRemove size={18} />
                                    </button>
                                    <span className="w-12 text-center text-[14px] font-black text-tss-black">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                                        className="p-3 text-tss-gray-500 hover:text-tss-red transition-colors"
                                    >
                                        <MdAdd size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="flex-[1.5] flex items-center justify-center gap-3 py-4 bg-tss-red text-white font-black text-[13px] uppercase tracking-[0.2em] rounded-sm hover:bg-red-700 transition-all shadow-xl active:scale-95 disabled:grayscale"
                                >
                                    <MdShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product._id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 border-2 font-black text-[11px] uppercase tracking-widest rounded-sm transition-all active:scale-95
                                        ${isWishlisted
                                            ? 'border-tss-red text-tss-red bg-red-50'
                                            : 'border-tss-gray-200 text-tss-gray-500 hover:border-tss-black hover:text-tss-black'}`}
                                >
                                    {isWishlisted ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
                                    {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                                </button>
                            </div>
                        </div>

                        {/* Trust markers */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-tss-gray-100">
                            <div className="flex flex-col items-center text-center gap-2">
                                <MdLocalShipping size={24} className="text-tss-gray-400" />
                                <p className="text-[9px] font-black text-tss-black uppercase leading-tight">Free Delivery</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <MdSecurity size={24} className="text-tss-gray-400" />
                                <p className="text-[9px] font-black text-tss-black uppercase leading-tight">Trusted Seller</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <MdCached size={24} className="text-tss-gray-400" />
                                <p className="text-[9px] font-black text-tss-black uppercase leading-tight">30 Day Returns</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <MdStar size={24} className="text-tss-gray-400" />
                                <p className="text-[9px] font-black text-tss-black uppercase leading-tight">Premium Quality</p>
                            </div>
                        </div>

                        {/* Description & Specs */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[14px] font-black text-tss-black uppercase tracking-widest mb-3">Product Description</h4>
                                <div className="text-[13px] text-tss-gray-500 leading-relaxed font-bold">
                                    {product.description || "Official quality merchandise from Nazrakart. Made with premium fabric for maximum comfort and style. Perfect for every occasion."}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 pt-6 border-t border-tss-gray-100">
                                <div>
                                    <h5 className="text-[10px] font-black text-tss-black uppercase tracking-widest mb-1">Fabric</h5>
                                    <p className="text-[12px] text-tss-gray-500 font-bold">100% Cotton</p>
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black text-tss-black uppercase tracking-widest mb-1">Fit</h5>
                                    <p className="text-[12px] text-tss-gray-500 font-bold">Regular Fit</p>
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black text-tss-black uppercase tracking-widest mb-1">Washing</h5>
                                    <p className="text-[12px] text-tss-gray-500 font-bold">Machine Wash Cold</p>
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black text-tss-black uppercase tracking-widest mb-1">Origin</h5>
                                    <p className="text-[12px] text-tss-gray-500 font-bold">Made in India</p>
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
