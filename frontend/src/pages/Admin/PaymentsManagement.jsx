import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    MdSearch,
    MdFilterList,
    MdVisibility,
    MdCheckCircle,
    MdPending,
    MdClose,
    MdPayment
} from 'react-icons/md';

const PaymentsManagement = () => {
    const { getToken, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const statuses = ['All', 'Paid', 'Pending'];

    useEffect(() => {
        if (user) {
            fetchPayments();
        }
    }, [user]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders?limit=1000`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok && data.orders) {
                // Determine payment status and format the data
                const mappedPayments = data.orders.map(o => ({
                    id: o._id,
                    orderId: o._id,
                    customer: o.user ? o.user.name : 'Unknown',
                    email: o.user ? o.user.email : 'No email',
                    amount: o.totalPrice,
                    method: o.paymentMethod === 'cod' ? 'Cash on Delivery' : o.paymentMethod === 'card' ? 'Credit/Debit Card' : o.paymentMethod === 'paypal' ? 'PayPal' : o.paymentMethod,
                    status: o.isPaid ? 'Paid' : 'Pending',
                    date: new Date(o.createdAt).toLocaleDateString(),
                    paidAt: o.isPaid ? new Date(o.paidAt).toLocaleString() : '-',
                    // Extracting ID correctly based on the model `paymentResult: { id: String }`
                    transactionId: o.paymentResult && o.paymentResult.id ? o.paymentResult.id : 'N/A'
                }));

                // Sort by date (newest first)
                mappedPayments.sort((a, b) => new Date(data.orders.find(o => o._id === b.id).createdAt) - new Date(data.orders.find(o => o._id === a.id).createdAt));

                setPayments(mappedPayments);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-white min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-500 mt-1">Track and manage customer transactions</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {statuses.slice(1).map((status) => {
                    const count = payments.filter(p => p.status === status).length;
                    const amount = payments.filter(p => p.status === status).reduce((acc, curr) => acc + curr.amount, 0);

                    return (
                        <div key={status} className={`p-4 rounded-xl border transition-all ${statusFilter === status ? 'bg-red-50 border-tss-red text-tss-red' : 'bg-white border-gray-200'} cursor-pointer hover:border-gray-300`} onClick={() => setStatusFilter(status)}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-2xl font-black text-gray-900">{count}</p>
                                    <p className={`text-sm font-bold uppercase tracking-wider ${statusFilter === status ? 'text-tss-red' : 'text-gray-500'}`}>{status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-gray-900">₹{amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Transaction ID, or Customer..."
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

            {/* Payments Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 font-bold">Loading payments...</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500 border-b border-gray-200 bg-gray-50 uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4">Transaction / Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Method</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-center">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500 font-medium">No payments found</td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-black truncate max-w-[120px]" title={payment.transactionId}>TXN: {payment.transactionId}</p>
                                                    <p className="text-sm font-bold text-tss-red">ORD: {payment.orderId.substring(0, 8)}...</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{payment.customer}</p>
                                                    <p className="text-xs text-gray-500">{payment.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-bold hidden md:table-cell">{payment.method}</td>
                                            <td className="px-6 py-4 text-sm font-black text-gray-900">₹{payment.amount}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium text-center">{payment.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedPayment(payment)}
                                                        className="p-2 text-gray-400 hover:text-tss-red hover:bg-red-50 rounded-md transition-colors"
                                                    >
                                                        <MdVisibility size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Payment Detail Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedPayment(null)} />
                    <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Payment Details</h2>
                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Transaction Info */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-black text-gray-900">Transaction Info</p>
                                    <p className="text-sm text-gray-500 font-medium">{selectedPayment.date}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider ${getStatusColor(selectedPayment.status)}`}>
                                    {selectedPayment.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-md bg-gray-50 border border-gray-100 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-bold text-gray-500 uppercase">Transaction ID</span>
                                        <span className="text-sm font-black text-gray-900 break-all ml-4 text-right">{selectedPayment.transactionId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-bold text-gray-500 uppercase">Order ID</span>
                                        <span className="text-sm font-black text-tss-red">{selectedPayment.orderId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-bold text-gray-500 uppercase">Payment Method</span>
                                        <span className="text-sm font-black text-gray-900">{selectedPayment.method}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-bold text-gray-500 uppercase">Paid At</span>
                                        <span className="text-sm font-bold text-gray-700">{selectedPayment.paidAt}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Customer Information</p>
                                <div className="p-4 rounded-md bg-gray-50 border border-gray-100 space-y-2">
                                    <p className="text-gray-900 font-bold">{selectedPayment.customer}</p>
                                    <p className="text-sm text-gray-500">{selectedPayment.email}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                <p className="text-gray-900 font-black text-lg">Total Amount</p>
                                <p className="text-2xl font-black text-tss-red">₹{selectedPayment.amount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsManagement;
