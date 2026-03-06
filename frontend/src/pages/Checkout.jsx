import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdLock, MdCheck, MdLocalShipping, MdPayment, MdArrowBack, MdArrowForward, MdShield } from 'react-icons/md';
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
        country: 'India',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('card');

    const freeShippingThreshold = 500;
    const subtotal = getCartTotal();
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 50;
    const total = subtotal + shippingCost;

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
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
                    quantity: item.quantity,
                    size: item.selectedSize
                })),
                shippingAddress: shippingInfo,
                paymentMethod,
                itemsPrice: subtotal,
                shippingPrice: shippingCost,
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
                toast.success('Successfully ordered!', {
                    icon: '🎉',
                    style: { borderRadius: '4px', background: '#117a7a', color: '#fff', fontSize: '12px', fontWeight: 'bold' },
                });
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Payment processing failed');
            }
        } catch (error) {
            console.error('Order failed:', error);
            toast.error('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !orderPlaced) {
        navigate('/shop');
        return null;
    }

    if (step === 3) {
        return (
            <div className="min-h-[80vh] bg-white flex items-center justify-center p-6">
                <div className="text-center max-w-lg">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-tss-green flex items-center justify-center text-white shadow-xl animate-bounce">
                        <MdCheck size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-tss-black mb-4 uppercase tracking-[0.1em]">Order Placed!</h2>
                    <p className="text-tss-gray-500 font-bold mb-10 leading-relaxed uppercase tracking-wider text-sm">
                        Thank you for shopping with Nazrakart. <br />
                        Your order is being processed and will be shipped soon.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/orders')}
                            className="tss-button-primary px-10"
                        >
                            VIEW MY ORDERS
                        </button>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-10 py-4 border-2 border-tss-black text-tss-black font-black text-[12px] uppercase tracking-widest hover:bg-tss-black hover:text-white transition-all"
                        >
                            CONTINUE SHOPPING
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header / Stepper */}
            <div className="bg-tss-gray-100 py-10 border-b border-tss-gray-200 mb-12">
                <div className="tss-container">
                    <div className="flex items-center justify-center max-w-md mx-auto relative">
                        {/* Connector Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-tss-gray-200 -translate-y-1/2 z-0"></div>
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-tss-red -translate-y-1/2 z-0 transition-all duration-500"
                            style={{ width: step === 1 ? '0%' : '100%' }}
                        ></div>

                        {/* Step Points */}
                        {[
                            { id: 1, label: 'Shipping', icon: MdLocalShipping },
                            { id: 2, label: 'Payment', icon: MdPayment },
                        ].map((s) => (
                            <div key={s.id} className="relative z-10 flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${step >= s.id ? 'bg-tss-red text-white shadow-lg' : 'bg-white text-tss-gray-400 border-2 border-tss-gray-200'
                                    }`}>
                                    {step > s.id ? <MdCheck size={20} /> : <s.icon size={20} />}
                                </div>
                                <span className={`absolute -bottom-6 text-[10px] font-black uppercase tracking-widest transition-colors ${step >= s.id ? 'text-tss-black' : 'text-tss-gray-400'
                                    }`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="tss-container">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Form Area */}
                    <div className="flex-[2]">
                        {step === 1 && (
                            <form onSubmit={handleShippingSubmit} className="space-y-8">
                                <div className="border-b border-tss-gray-100 pb-4">
                                    <h2 className="text-xl font-black text-tss-black uppercase tracking-widest">Delivery Address</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-tss-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.fullName}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                                            className="tss-input"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-tss-gray-400 uppercase tracking-widest mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.street}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                                            className="tss-input"
                                            placeholder="House No, Street, Locality"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-tss-gray-400 uppercase tracking-widest mb-2">City</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.city}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                            className="tss-input"
                                            placeholder="City"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-tss-gray-400 uppercase tracking-widest mb-2">State</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.state}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                            className="tss-input"
                                            placeholder="State"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-tss-gray-400 uppercase tracking-widest mb-2">Pincode</label>
                                        <input
                                            type="text"
                                            value={shippingInfo.zipCode}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                                            className="tss-input"
                                            placeholder="6-digit Pincode"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-tss-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={shippingInfo.phone}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                            className="tss-input"
                                            placeholder="10-digit Mobile Number"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-tss-black text-white font-black text-[13px] uppercase tracking-[0.2em] rounded-sm hover:bg-tss-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    SAVE & CONTINUE
                                    <MdArrowForward size={20} />
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handlePlaceOrder} className="space-y-8">
                                <div className="border-b border-tss-gray-100 pb-4">
                                    <h2 className="text-xl font-black text-tss-black uppercase tracking-widest">Payment Strategy</h2>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'card', label: 'Credit / Debit Card', desc: 'Secure payment via SSL encrypted gateway' },
                                        { id: 'upi', label: 'UPI / NetBanking', desc: 'Fast & Secure digital payment' },
                                        { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive the order' },
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-5 p-6 rounded-sm border-2 cursor-pointer transition-all ${paymentMethod === method.id
                                                    ? 'border-tss-red bg-red-50/30 shadow-md scale-[1.01]'
                                                    : 'border-tss-gray-100 hover:border-tss-gray-300'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-tss-red' : 'border-tss-gray-300'
                                                }`}>
                                                {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-tss-red"></div>}
                                            </div>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="hidden"
                                            />
                                            <div className="flex-1">
                                                <span className="text-[14px] font-black text-tss-black uppercase tracking-widest block">{method.label}</span>
                                                <span className="text-[11px] font-bold text-tss-gray-400 uppercase tracking-wider">{method.desc}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 border-2 border-tss-gray-200 text-tss-gray-500 font-black text-[12px] uppercase tracking-widest rounded-sm hover:border-tss-black hover:text-tss-black transition-all"
                                    >
                                        <MdArrowBack size={18} className="inline mr-2" />
                                        BACK
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-4 bg-tss-red text-white font-black text-[13px] uppercase tracking-[0.2em] rounded-sm hover:bg-red-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:grayscale"
                                    >
                                        <MdLock size={18} />
                                        {loading ? 'PROCESSING...' : 'CONFIRM ORDER'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <aside className="flex-1">
                        <div className="lg:sticky lg:top-32 border border-tss-gray-200 rounded-sm p-8 bg-tss-gray-50">
                            <h2 className="text-[14px] font-black text-tss-black uppercase tracking-widest border-b border-tss-gray-200 pb-4 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto no-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={`${item._id}-${item.selectedSize}`} className="flex items-center gap-4">
                                        <div className="w-14 h-18 rounded-sm overflow-hidden flex-shrink-0 bg-white shadow-sm">
                                            <img src={item.images?.[0] || item.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-black text-tss-black uppercase truncate tracking-tight">{item.name}</p>
                                            <p className="text-[10px] font-bold text-tss-gray-400 uppercase tracking-widest mt-0.5">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-[12px] font-black text-tss-black">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-tss-gray-200 space-y-4 mb-8">
                                <div className="flex justify-between text-[11px] font-bold text-tss-gray-500 uppercase tracking-widest">
                                    <span>Base Amount</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-tss-gray-500 uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? 'text-tss-green font-black' : 'text-tss-black'}>
                                        {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[16px] font-black text-tss-black uppercase tracking-[0.1em] pt-4 border-t border-tss-gray-200">
                                    <span>TOTAL</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="bg-white border border-tss-gray-200 rounded-sm p-4">
                                <p className="text-[10px] text-tss-gray-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
                                    <MdShield className="text-tss-green" size={16} />
                                    100% Genuine Products
                                </p>
                                <p className="text-[10px] text-tss-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <MdLock className="text-tss-gray-400" size={16} />
                                    SSL Secure Transaction
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
