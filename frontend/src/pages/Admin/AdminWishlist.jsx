import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdTrendingUp, MdFavorite, MdRefresh } from 'react-icons/md';

const AdminWishlist = () => {
    const { getToken, user } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/admin/stats`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchStats();
        }
    }, [user]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading wishlist data...</div>;

    return (
        <div className="p-6 lg:p-8 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider flex items-center gap-3">
                        <MdFavorite className="text-tss-red" />
                        Wishlist Activity
                    </h1>
                    <p className="text-gray-500 mt-2">See which products are most popular among users' wishlists.</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-bold hover:bg-gray-200 transition-colors shadow-sm"
                >
                    <MdRefresh size={20} />
                    Refresh Stats
                </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 uppercase flex items-center gap-2">
                        <MdTrendingUp className="text-green-600" />
                        Top 10 Wishlisted Products
                    </h2>
                </div>

                {stats.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No products have been wishlisted yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                                    <th className="px-6 py-4 font-bold">Rank</th>
                                    <th className="px-6 py-4 font-bold">Product</th>
                                    <th className="px-6 py-4 font-bold">Price</th>
                                    <th className="px-6 py-4 font-bold">Wishlist Count</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {stats.map((stat, index) => (
                                    <tr key={stat.product?._id || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-gray-200 text-gray-700' :
                                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-gray-100 text-gray-600'
                                                }`}>
                                                #{index + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-16 rounded overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                    {stat.product?.image || stat.product?.images?.[0] ? (
                                                        <img
                                                            src={stat.product.image || stat.product.images[0]}
                                                            alt={stat.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-gray-900 line-clamp-2">{stat.product ? stat.product.name : 'Unknown Product'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-600">
                                            ₹{stat.product?.price || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MdFavorite className="text-tss-red" />
                                                <span className="font-bold text-gray-900 text-lg">{stat.wishlistCount}</span>
                                                <span className="text-gray-500 text-sm">users</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWishlist;
