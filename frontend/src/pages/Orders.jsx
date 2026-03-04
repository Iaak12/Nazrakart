import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBag, MdLocalShipping, MdCheck, MdClose } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { getToken } = useAuth();
    const { formatPrice } = useCurrency();

    useEffect(() => {
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
        switch (status) {
            case 'delivered': return 'bg-green-50 text-green-600 border-green-200';
            case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'processing': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <MdCheck size={16} />;
            case 'shipped': return <MdLocalShipping size={16} />;
            case 'cancelled': return <MdClose size={16} />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                            <MdShoppingBag className="text-gray-300" size={40} />
                        </div>
                        <p className="text-gray-500 mb-4">No orders yet</p>
                        <Link to="/shop" className="inline-flex px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="text-gray-900 font-semibold">Order #{order._id?.slice(-8).toUpperCase()}</p>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <p className="text-xl font-bold text-gray-900">{formatPrice(order.totalPrice)}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-4">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                                <img
                                                    src={item.image || 'https://picsum.photos/100/100'}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="text-gray-900 font-medium">{item.name}</p>
                                                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                                    <p className="text-gray-700">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                    >
                                        {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                                    </button>
                                </div>

                                {/* Order Details (Expandable) */}
                                {selectedOrder === order._id && (
                                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h4>
                                                <p className="text-gray-600 text-sm">
                                                    {order.shippingAddress?.fullName}<br />
                                                    {order.shippingAddress?.street}<br />
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Payment</h4>
                                                <p className="text-gray-600 text-sm capitalize">{order.paymentMethod}</p>
                                                <div className="mt-3 space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Subtotal</span>
                                                        <span className="text-gray-700">{formatPrice(order.itemsPrice)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Shipping</span>
                                                        <span className="text-gray-700">{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Tax</span>
                                                        <span className="text-gray-700">{formatPrice(order.taxPrice)}</span>
                                                    </div>
                                                </div>
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
