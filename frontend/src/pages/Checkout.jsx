import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLock, MdCheck } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user, getToken } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: user?.name || '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('card');

    const shippingCost = getCartTotal() >= 50 ? 0 : 5.99;
    const tax = getCartTotal() * 0.08;
    const total = getCartTotal() + shippingCost + tax;

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    image: item.images?.[0] || item.image || '',
                    price: item.price,
                    quantity: item.quantity
                })),
                shippingAddress: shippingInfo,
                paymentMethod,
                itemsPrice: getCartTotal(),
                shippingPrice: shippingCost,
                taxPrice: tax,
                totalPrice: total
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                setOrderPlaced(true);
                clearCart();
                setStep(3);
                toast.success('Order placed successfully!');
            } else {
                const errorData = await response.json();
                // Show the exact database error if 'error' field exists
                const exactError = errorData.error ? `Server Error: ${errorData.error}` : errorData.message;
                toast.error(exactError || 'Failed to place order', { duration: 6000 });
            }
        } catch (error) {
            console.error('Order failed:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !orderPlaced) {
        navigate('/cart');
        return null;
    }

    if (step === 3) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                        <MdCheck className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-500 mb-8">
                        Thank you for your order. You'll receive a confirmation email shortly.
                    </p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800"
                    >
                        View Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                {/* Steps */}
                <div className="flex items-center justify-center mb-12">
                    {['Shipping', 'Payment'].map((label, index) => (
                        <React.Fragment key={label}>
                            <div className={`flex items-center gap-2 ${step > index + 1 ? 'text-green-600' : step === index + 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-medium ${step > index + 1 ? 'bg-green-600 border-green-600 text-white' : step === index + 1 ? 'border-gray-900 text-gray-900' : 'border-gray-300'
                                    }`}>
                                    {step > index + 1 ? <MdCheck size={18} /> : index + 1}
                                </div>
                                <span className="font-medium">{label}</span>
                            </div>
                            {index < 1 && <div className={`w-20 h-0.5 mx-4 ${step > index + 1 ? 'bg-green-600' : 'bg-gray-200'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <form onSubmit={handleShippingSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.fullName}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                    <input
                                        type="text"
                                        value={shippingInfo.street}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.city}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.state}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.zipCode}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={shippingInfo.phone}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800"
                                >
                                    Continue to Payment
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

                                <div className="space-y-3">
                                    {[
                                        { id: 'card', label: 'Credit/Debit Card' },
                                        { id: 'paypal', label: 'PayPal' },
                                        { id: 'cod', label: 'Cash on Delivery' },
                                    ].map((method) => (
                                        <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-4 h-4 text-gray-900"
                                            />
                                            <span className="text-gray-900 font-medium">{method.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800"
                                    >
                                        <MdLock size={18} />
                                        {loading ? 'Processing...' : 'Place Order'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex items-center gap-3">
                                        <img src={item.images?.[0] || item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-900 text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-gray-900 text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-2">
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">{formatPrice(getCartTotal())}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Tax</span>
                                    <span className="text-gray-900">{formatPrice(tax)}</span>
                                </div>
                                <div className="flex justify-between text-gray-900 font-semibold pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
