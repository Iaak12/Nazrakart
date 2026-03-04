import React, { useState } from 'react';
import {
    MdSearch,
    MdFilterList,
    MdVisibility,
    MdLocalShipping,
    MdCheckCircle,
    MdPending,
    MdClose
} from 'react-icons/md';

const OrderManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');

    const [orders, setOrders] = useState([
        {
            id: '#ORD-7821',
            customer: 'John Doe',
            email: 'john@email.com',
            items: [
                { name: 'iPhone 15 Pro', qty: 1, price: 1299 }
            ],
            total: 1299,
            status: 'Delivered',
            date: '2026-02-04',
            address: '123 Main St, New York, NY 10001'
        },
        {
            id: '#ORD-7820',
            customer: 'Jane Smith',
            email: 'jane@email.com',
            items: [
                { name: 'MacBook Air M3', qty: 1, price: 1499 }
            ],
            total: 1499,
            status: 'Shipped',
            date: '2026-02-03',
            address: '456 Oak Ave, Los Angeles, CA 90001'
        },
        {
            id: '#ORD-7819',
            customer: 'Mike Johnson',
            email: 'mike@email.com',
            items: [
                { name: 'AirPods Pro 2', qty: 2, price: 249 }
            ],
            total: 498,
            status: 'Processing',
            date: '2026-02-02',
            address: '789 Pine Rd, Chicago, IL 60601'
        },
        {
            id: '#ORD-7818',
            customer: 'Sarah Wilson',
            email: 'sarah@email.com',
            items: [
                { name: 'iPad Pro 12.9"', qty: 1, price: 1099 }
            ],
            total: 1099,
            status: 'Pending',
            date: '2026-02-01',
            address: '321 Elm Blvd, Houston, TX 77001'
        },
        {
            id: '#ORD-7817',
            customer: 'Chris Brown',
            email: 'chris@email.com',
            items: [
                { name: 'Apple Watch Ultra', qty: 1, price: 799 },
                { name: 'Sport Band', qty: 2, price: 49 }
            ],
            total: 897,
            status: 'Delivered',
            date: '2026-01-31',
            address: '654 Maple Dr, Phoenix, AZ 85001'
        },
        {
            id: '#ORD-7816',
            customer: 'Emily Davis',
            email: 'emily@email.com',
            items: [
                { name: 'Samsung Galaxy S24', qty: 1, price: 899 }
            ],
            total: 899,
            status: 'Cancelled',
            date: '2026-01-30',
            address: '987 Cedar Ln, Seattle, WA 98101'
        },
    ]);

    const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Processing': return 'bg-yellow-100 text-yellow-700';
            case 'Pending': return 'bg-gray-100 text-gray-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <MdCheckCircle className="text-green-600" />;
            case 'Shipped': return <MdLocalShipping className="text-blue-600" />;
            case 'Processing': return <MdPending className="text-yellow-600" />;
            default: return <MdPending className="text-gray-400" />;
        }
    };

    const updateStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-white min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-500 mt-1">Manage and track customer orders</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {statuses.slice(1).map((status) => {
                    const count = orders.filter(o => o.status === status).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`p-4 rounded-xl border transition-all ${statusFilter === status
                                ? 'bg-red-50 border-tss-red text-tss-red'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <p className="text-2xl font-black text-gray-900">{count}</p>
                            <p className={`text-sm font-bold uppercase tracking-wider ${statusFilter === status ? 'text-tss-red' : 'text-gray-500'}`}>{status}</p>
                        </button>
                    );
                })}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-bold"
                >
                    {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-gray-500 border-b border-gray-200 bg-gray-50 uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4 hidden md:table-cell">Date</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-tss-red">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{order.customer}</p>
                                            <p className="text-xs text-gray-500">{order.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell font-medium">{order.date}</td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-900">₹{order.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 text-gray-400 hover:text-tss-red hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <MdVisibility size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                    <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Order Details</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Order Info */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-black text-tss-red">{selectedOrder.id}</p>
                                    <p className="text-sm text-gray-500 font-medium">{selectedOrder.date}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>

                            {/* Customer Info */}
                            <div className="p-4 rounded-md bg-gray-50 border border-gray-100 space-y-2">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Customer</p>
                                <p className="text-gray-900 font-bold">{selectedOrder.customer}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.address}</p>
                            </div>

                            {/* Order Items */}
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Items</p>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-md border border-gray-100 bg-gray-50">
                                            <div>
                                                <p className="text-gray-900 font-bold">{item.name}</p>
                                                <p className="text-sm text-gray-500 font-medium">Qty: {item.qty}</p>
                                            </div>
                                            <p className="text-gray-900 font-black">₹{item.price * item.qty}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-gray-900 font-black text-lg">Total</p>
                                    <p className="text-xl font-black text-tss-red">₹{selectedOrder.total}</p>
                                </div>
                            </div>

                            {/* Update Status */}
                            {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                                <div>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Update Status</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Processing', 'Shipped', 'Delivered'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => updateStatus(selectedOrder.id, status)}
                                                disabled={selectedOrder.status === status}
                                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${selectedOrder.status === status
                                                    ? 'bg-tss-red text-white'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
