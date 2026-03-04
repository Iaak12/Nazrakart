import React, { useState, useEffect } from 'react';
import {
    MdTrendingUp,
    MdShoppingCart,
    MdInventory,
    MdPeople,
    MdArrowUpward,
    MdArrowDownward,
    MdMoreVert
} from 'react-icons/md';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">Loading Dashboard...</div>;
    if (!data) return <div className="p-8 text-center text-red-500 font-bold uppercase tracking-widest">Failed to load Dashboard data</div>;

    const stats = [
        {
            title: 'Total Revenue',
            value: data.stats.totalRevenue,
            change: data.stats.totalRevenueChange,
            isPositive: data.stats.isRevenuePositive,
            icon: MdTrendingUp,
            gradient: 'from-red-500 to-tss-red',
            shadowColor: 'shadow-red-500/20'
        },
        {
            title: 'Total Orders',
            value: data.stats.totalOrders.toLocaleString(),
            change: data.stats.totalOrdersChange,
            isPositive: data.stats.isOrdersPositive,
            icon: MdShoppingCart,
            gradient: 'from-gray-700 to-gray-900',
            shadowColor: 'shadow-gray-500/20'
        },
        {
            title: 'Total Products',
            value: data.stats.totalProducts.toLocaleString(),
            change: data.stats.totalProductsChange,
            isPositive: data.stats.isProductsPositive,
            icon: MdInventory,
            gradient: 'from-gray-700 to-gray-900',
            shadowColor: 'shadow-gray-500/20'
        },
        {
            title: 'Total Customers',
            value: data.stats.totalCustomers.toLocaleString(),
            change: data.stats.totalCustomersChange,
            isPositive: data.stats.isCustomersPositive,
            icon: MdPeople,
            gradient: 'from-tss-red to-red-700',
            shadowColor: 'shadow-red-500/20'
        },
    ];

    const { recentOrders, topProducts } = data;

    // Helper for status colors
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700'; // pending
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-8 bg-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
                </div>
                <button className="px-5 py-2.5 bg-tss-red text-white rounded-md font-bold uppercase tracking-widest shadow-md hover:opacity-90 transition-all duration-300">
                    Download Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 hover:border-gray-300 shadow-sm transition-all duration-300 group`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-3">
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.title}</p>
                                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                                <div className={`flex items-center gap-1 text-sm font-bold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.isPositive ? <MdArrowUpward size={16} /> : <MdArrowDownward size={16} />}
                                    <span>{stat.change}</span>
                                    <span className="text-gray-400 font-medium ml-1">vs last month</span>
                                </div>
                            </div>
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md ${stat.shadowColor}`}>
                                <stat.icon size={24} className="text-white" />
                            </div>
                        </div>
                        {/* Decorative gradient */}
                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300`} />
                    </div>
                ))}
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Recent Orders</h2>
                            <p className="text-sm text-gray-500">Latest transactions from your store</p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                            <MdMoreVert size={20} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500 border-b border-gray-100 bg-gray-50 font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4 hidden sm:table-cell">Product</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-tss-red">{order.id}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.customer}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{order.product}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <button className="w-full py-2.5 text-sm font-bold text-tss-red hover:text-red-700 transition-colors uppercase tracking-widest">
                            View All Orders →
                        </button>
                    </div>
                </div>

                {/* Top Products */}
                <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Top Products</h2>
                        <p className="text-sm text-gray-500">Best selling items this month</p>
                    </div>
                    <div className="p-4 space-y-4 flex-1">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-md border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-md object-cover border border-gray-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">{product.sales} sales</p>
                                </div>
                                <p className="text-sm font-black text-gray-900">{product.revenue}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50 mt-auto">
                        <button className="w-full py-2.5 text-sm font-bold text-tss-red hover:text-red-700 transition-colors uppercase tracking-widest">
                            View All Products →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
