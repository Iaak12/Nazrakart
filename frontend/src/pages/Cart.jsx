import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdAdd, MdRemove, MdShoppingCart } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { formatPrice, getRate } = useCurrency();
    const navigate = useNavigate();

    const shippingCost = getCartTotal() >= 50 ? 0 : 5.99;
    const tax = getCartTotal() * 0.08;
    const total = getCartTotal() + shippingCost + tax;

    const handleCheckout = () => {
        if (isAuthenticated()) {
            navigate('/checkout');
        } else {
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                        <MdShoppingCart className="text-gray-300" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything yet</p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex gap-6 p-6 bg-white rounded-2xl shadow-sm"
                            >
                                <Link to={`/product/${item._id}`} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <Link to={`/product/${item._id}`} className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
                                        {item.name}
                                    </Link>
                                    <p className="text-gray-400 text-sm mt-1">{item.category}</p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-gray-200 rounded-full">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                                            >
                                                <MdRemove size={18} />
                                            </button>
                                            <span className="w-8 text-center text-gray-900 text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                                            >
                                                <MdAdd size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <span className="text-gray-900 font-semibold">{formatPrice(item.price * item.quantity)}</span>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="text-gray-900 font-medium">{formatPrice(getCartTotal())}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                                        {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (8%)</span>
                                    <span className="text-gray-900">{formatPrice(tax)}</span>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between">
                                        <span className="text-gray-900 font-semibold">Total</span>
                                        <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            {getCartTotal() < 50 && (
                                <p className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                                    💡 Add {formatPrice(50 - getCartTotal())} more for free shipping!
                                </p>
                            )}

                            <button
                                onClick={handleCheckout}
                                className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all"
                            >
                                Proceed to Checkout
                            </button>

                            <Link to="/shop" className="block mt-4 text-center text-gray-500 hover:text-gray-900 text-sm transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
