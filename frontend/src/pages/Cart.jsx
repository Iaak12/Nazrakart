import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdAdd, MdRemove, MdShoppingCart, MdLocalShipping, MdShield, MdArrowForward, MdInfoOutline } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const freeShippingThreshold = 500; // Assuming INR or similar scale for this UI
    const subtotal = getCartTotal();
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 50;
    const total = subtotal + shippingCost;

    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

    const handleCheckout = () => {
        if (isAuthenticated()) {
            navigate('/checkout');
        } else {
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center py-20">
                <div className="text-center max-w-md px-4">
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-tss-gray-100 flex items-center justify-center text-tss-gray-300">
                        <MdShoppingCart size={64} />
                    </div>
                    <h2 className="text-2xl font-black text-tss-black mb-4 uppercase tracking-widest">Your cart is empty</h2>
                    <p className="text-tss-gray-500 font-bold text-sm uppercase tracking-wider mb-10">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/shop" className="tss-button-primary inline-block w-full">START SHOPPING</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="bg-tss-gray-100 py-6 border-b border-tss-gray-200 mb-10">
                <div className="tss-container">
                    <h1 className="text-2xl font-black text-tss-black uppercase tracking-[0.2em]">My Cart ({cartItems.length} items)</h1>
                </div>
            </div>

            <div className="tss-container">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left: Cart Items */}
                    <div className="flex-[2] space-y-6">
                        {/* Free Shipping Progress */}
                        <div className="bg-tss-gray-50 border border-tss-gray-200 rounded-sm p-6 mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[11px] font-black text-tss-black uppercase tracking-widest">
                                    {subtotal >= freeShippingThreshold
                                        ? "🎉 Congratulations! You get FREE shipping!"
                                        : `Add ${formatPrice(freeShippingThreshold - subtotal)} more for FREE shipping`}
                                </p>
                                <MdLocalShipping className={subtotal >= freeShippingThreshold ? 'text-tss-green' : 'text-tss-gray-400'} size={20} />
                            </div>
                            <div className="h-2 bg-tss-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${subtotal >= freeShippingThreshold ? 'bg-tss-green' : 'bg-tss-red'}`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {cartItems.map((item) => (
                            <div
                                key={`${item._id}-${item.selectedSize}`}
                                className="flex gap-4 md:gap-8 p-4 md:p-6 border border-tss-gray-100 rounded-sm hover:shadow-md transition-shadow relative group"
                            >
                                <Link to={`/product/${item._id}`} className="w-24 h-32 md:w-32 md:h-40 rounded-sm overflow-hidden flex-shrink-0 bg-tss-gray-100">
                                    <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                                </Link>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <Link to={`/product/${item._id}`} className="text-[14px] md:text-[16px] font-black text-tss-black uppercase tracking-tight hover:text-tss-red transition-colors">
                                                {item.name}
                                            </Link>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-tss-gray-300 hover:text-tss-red transition-colors p-1"
                                                title="Remove Item"
                                            >
                                                <MdDelete size={22} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            <span className="text-[10px] font-black text-tss-gray-400 uppercase tracking-widest">
                                                Size: <span className="text-tss-black">{item.selectedSize || 'N/A'}</span>
                                            </span>
                                            <span className="text-[10px] font-black text-tss-gray-400 uppercase tracking-widest">
                                                Qty: <span className="text-tss-black">{item.quantity}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-black text-tss-black">{formatPrice(item.price)}</span>
                                            {item.comparePrice > item.price && (
                                                <span className="text-sm text-tss-gray-400 line-through font-bold">{formatPrice(item.comparePrice)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 md:mt-0">
                                        <div className="flex items-center border border-tss-gray-200 rounded-sm overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="p-2 text-tss-gray-400 hover:text-tss-red hover:bg-tss-gray-50 transition-colors"
                                            >
                                                <MdRemove size={16} />
                                            </button>
                                            <span className="w-10 text-center text-[12px] font-black text-tss-black bg-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="p-2 text-tss-gray-400 hover:text-tss-red hover:bg-tss-gray-50 transition-colors"
                                            >
                                                <MdAdd size={16} />
                                            </button>
                                        </div>
                                        <p className="text-[14px] font-black text-tss-black">
                                            Total: {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between pt-6">
                            <Link to="/shop" className="text-[11px] font-black text-tss-gray-500 uppercase tracking-widest hover:text-tss-red flex items-center gap-1">
                                <MdArrowForward className="rotate-180" size={16} />
                                Continue Shopping
                            </Link>
                            <button
                                onClick={clearCart}
                                className="text-[11px] font-black text-tss-gray-400 uppercase tracking-widest hover:text-tss-red transition-colors"
                            >
                                Clear All Items
                            </button>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <aside className="flex-1">
                        <div className="lg:sticky lg:top-32 space-y-6">
                            {/* Membership Ad */}
                            {!user?.isTriBeMember && (
                                <div className="bg-[#117a7a] text-white p-6 rounded-sm relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-black uppercase tracking-widest mb-2">Join the TriBe</h3>
                                        <p className="text-[11px] font-bold opacity-90 mb-4 leading-relaxed">Early access to collection, extra discounts, and free shipping on all orders.</p>
                                        <button className="bg-white text-[#117a7a] px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-opacity-90 transition-all">
                                            Learn More
                                        </button>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <MdFlashOn size={120} />
                                    </div>
                                </div>
                            )}

                            {/* Bill Details */}
                            <div className="border border-tss-gray-200 rounded-sm p-8 bg-tss-gray-50">
                                <h2 className="text-[14px] font-black text-tss-black uppercase tracking-widest border-b border-tss-gray-200 pb-4 mb-6">Price Details</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-[12px] font-bold text-tss-gray-600 uppercase tracking-wider">
                                        <span>Total MRP (Inc. taxes)</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-[12px] font-bold text-tss-gray-600 uppercase tracking-wider">
                                        <span>Shipping Charges</span>
                                        <span className={shippingCost === 0 ? 'text-tss-green' : 'text-tss-black'}>
                                            {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[12px] font-bold text-tss-gray-600 uppercase tracking-wider">
                                        <span>Cart Total</span>
                                        <span className="text-tss-black">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-tss-gray-200 pt-6 mb-8">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[16px] font-black text-tss-black uppercase tracking-[0.1em]">Amount Payable</span>
                                        <span className="text-[20px] font-black text-tss-black">{formatPrice(total)}</span>
                                    </div>
                                    <p className="text-[10px] text-tss-green font-black uppercase tracking-widest flex items-center gap-1">
                                        <MdShield size={14} /> Safe & Secure Payments
                                    </p>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-tss-red text-white font-black text-[13px] uppercase tracking-[0.2em] rounded-sm hover:bg-red-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Proceed To Checkout
                                    <MdArrowForward size={20} />
                                </button>
                            </div>

                            {/* Coupon Code Block (Mock) */}
                            <div className="border-2 border-dashed border-tss-gray-200 rounded-sm p-6 flex items-center justify-between">
                                <span className="text-[11px] font-black text-tss-gray-500 uppercase tracking-widest">Apply Coupon Code</span>
                                <button className="text-[11px] font-black text-tss-red uppercase tracking-widest hover:underline">Apply</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Cart;
