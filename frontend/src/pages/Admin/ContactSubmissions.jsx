import React, { useState, useEffect } from 'react';
import { MdEmail, MdDelete, MdCheckCircle, MdOutlineRadioButtonUnchecked } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const ContactSubmissions = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setInquiries(data);
            }
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const deleteInquiry = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            const token = user?.token || localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                setInquiries(inquiries.filter(inq => inq._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete inquiry:', error);
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-tss-red rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage contact form submissions</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <MdEmail size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Messages</p>
                            <h3 className="text-2xl font-bold text-gray-900">{inquiries.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No messages found.
                                    </td>
                                </tr>
                            ) : (
                                inquiries.map((inq) => (
                                    <tr key={inq._id} className={inq.status === 'unread' ? 'bg-blue-50/50' : 'bg-white'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(inq.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{inq.name}</div>
                                            <div className="text-sm text-gray-500">{inq.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{inq.subject}</div>
                                            <div className="text-sm text-gray-500 max-w-xs truncate" title={inq.message}>{inq.message}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${inq.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleStatus(inq._id, inq.status)}
                                                    className={`hover:text-blue-600 transition-colors ${inq.status === 'unread' ? 'text-blue-500' : 'text-gray-400'}`}
                                                    title={inq.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
                                                >
                                                    {inq.status === 'unread' ? <MdCheckCircle size={20} /> : <MdOutlineRadioButtonUnchecked size={20} />}
                                                </button>
                                                <button
                                                    onClick={() => deleteInquiry(inq._id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <MdDelete size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContactSubmissions;
