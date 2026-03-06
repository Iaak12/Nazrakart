import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdShoppingBag, MdLocalShipping, MdCheck, MdClose, MdKeyboardArrowDown, MdKeyboardArrowUp, MdArrowForward } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { getToken, isAuthenticated } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'text-tss-green bg-green-50 border-green-100';
            case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'processing': return 'text-[#117a7a] bg-[#117a7a]/5 border-[#117a7a]/10';
            case 'cancelled': return 'text-tss-red bg-red-50 border-red-100';
            default: return 'text-tss-gray-400 bg-tss-gray-50 border-tss-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-tss-gray-200 border-t-tss-red rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header */}
            <div className="bg-tss-gray-100 py-10 border-b border-tss-gray-200 mb-12">
                <div className="tss-container">
                    <h1 className="text-2xl md:text-3xl font-black text-tss-black uppercase tracking-[0.2em] flex items-center gap-4">
                        Order History
                        <span className="text-tss-gray-400 text-sm font-bold tracking-widest mt-1">
                            ({orders.length} Orders)
                        </span>
                    </h1>
                </div>
            </div>

            <div className="tss-container">
                {orders.length === 0 ? (
                    <div className="max-w-md mx-auto text-center py-20 px-6 bg-tss-gray-50 rounded-sm border border-tss-gray-100">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <MdShoppingBag className="text-tss-gray-200" size={48} />
                        </div>
                        <h2 className="text-xl font-black text-tss-black mb-3 uppercase tracking-widest">No Orders Found</h2>
                        <p className="text-[12px] text-tss-gray-500 font-bold uppercase tracking-wider mb-10 leading-relaxed">
                            Looks like you haven't placed any orders yet. <br />
                            Time to start your shopping journey!
                        </p>
                        <Link to="/shop" className="tss-button-primary inline-block w-full">START SHOPPING</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="border border-tss-gray-200 rounded-sm overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
                                {/* Order Main Strip */}
                                <div
                                    className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                >
                                    <div className="flex gap-6 items-center">
                                        <div className="flex flex-wrap gap-2">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="w-12 h-16 md:w-16 md:h-20 rounded-sm overflow-hidden bg-tss-gray-50 border border-tss-gray-100 flex-shrink-0 shadow-sm">
                                                    <img src={item.image || 'https://via.placeholder.com/100x133'} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <div className="w-12 h-16 md:w-16 md:h-20 rounded-sm bg-tss-gray-100 flex items-center justify-center text-[10px] font-black text-tss-gray-500 uppercase">
                                                    +{order.items.length - 3} More
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[14px] font-black text-tss-black uppercase tracking-widest">Order ID: #{order._id?.slice(-8).toUpperCase()}</p>
                                            <p className="text-[10px] font-bold text-tss-gray-400 uppercase tracking-widest">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-[16px] font-black text-tss-black mt-2">{formatPrice(order.totalPrice)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-4 md:pt-0">
                                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full bg-current`}></div>
                                            {order.status || 'Processing'}
                                        </div>
                                        <div className="text-tss-gray-400">
                                            {selectedOrder === order._id ? <MdKeyboardArrowUp size={24} /> : <MdKeyboardArrowDown size={24} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {selectedOrder === order._id && (
                                    <div className="bg-tss-gray-50 border-t border-tss-gray-200 p-6 md:p-10">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                            {/* Item List */}
                                            <div className="lg:col-span-2 space-y-6">
                                                <h3 className="text-[11px] font-black text-tss-black uppercase tracking-[0.2em] border-b border-tss-gray-200 pb-2">Order Items</h3>
                                                {order.items?.map((item, index) => (
                                                    <div key={index} className="flex gap-6 items-start">
                                                        <Link to={`/product/${item.product}`} className="w-16 h-20 md:w-20 md:h-24 rounded-sm overflow-hidden bg-white shadow-sm flex-shrink-0">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </Link>
                                                        <div className="flex-1">
                                                            <Link to={`/product/${item.product}`} className="text-[13px] font-black text-tss-black uppercase tracking-tight hover:text-tss-red">
                                                                {item.name}
                                                            </Link>
                                                            <p className="text-[10px] font-bold text-tss-gray-500 uppercase tracking-widest mt-1">Size: {item.size || 'N/A'}</p>
                                                            <p className="text-[10px] font-bold text-tss-gray-500 uppercase tracking-widest">Quantity: {item.quantity}</p>
                                                            <p className="text-[13px] font-black text-tss-black mt-2">{formatPrice(item.price)}</p>
                                                        </div>
                                                        <Link
                                                            to={`/product/${item.product}`}
                                                            className="text-[10px] font-black text-tss-red uppercase tracking-widest hover:underline whitespace-nowrap"
                                                        >
                                                            BUY AGAIN
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Shipping & Payment Summary */}
                                            <div className="space-y-8">
                                                <div>
                                                    <h3 className="text-[11px] font-black text-tss-black uppercase tracking-[0.2em] border-b border-tss-gray-200 pb-2 mb-4">Delivery Address</h3>
                                                    <div className="text-[11px] font-bold text-tss-gray-500 uppercase tracking-wider leading-relaxed">
                                                        <p className="text-tss-black mb-1">{order.shippingAddress?.fullName}</p>
                                                        <p>{order.shippingAddress?.street}</p>
                                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
                                                        <p className="mt-2 flex items-center gap-2">
                                                            <MdLocalShipping size={14} /> Phone: {order.shippingAddress?.phone}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-6 rounded-sm border border-tss-gray-200">
                                                    <h3 className="text-[10px] font-black text-tss-black uppercase tracking-widest mb-4">Order Summary</h3>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-[11px] font-bold text-tss-gray-500 uppercase tracking-widest">
                                                            <span>Item Total</span>
                                                            <span>{formatPrice(order.itemsPrice)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px] font-bold text-tss-gray-500 uppercase tracking-widest">
                                                            <span>Shipping</span>
                                                            <span className={order.shippingPrice === 0 ? 'text-tss-green font-black' : 'text-tss-black'}>
                                                                {order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-[12px] font-black text-tss-black uppercase tracking-widest pt-3 border-t border-tss-gray-100">
                                                            <span>Paid Amount</span>
                                                            <span>{formatPrice(order.totalPrice)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[9px] font-black text-tss-gray-400 uppercase tracking-widest mt-4 text-center">
                                                        Method: {order.paymentMethod}
                                                    </p>
                                                </div>

                                                <button className="w-full py-4 border-2 border-tss-black text-tss-black font-black text-[11px] uppercase tracking-widest hover:bg-tss-black hover:text-white transition-all">
                                                    DOWNLOAD INVOICE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
