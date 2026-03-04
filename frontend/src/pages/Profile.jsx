import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdShoppingBag, MdSettings, MdLogout, MdChevronRight } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { icon: MdShoppingBag, label: 'My Orders', desc: 'View order history', link: '/orders' },
        { icon: MdSettings, label: 'Account Settings', desc: 'Manage profile & password', link: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                <MdEmail size={16} />
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                        <p className="text-3xl font-bold text-gray-900">0</p>
                        <p className="text-gray-500 text-sm">Orders</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                        <p className="text-3xl font-bold text-gray-900">0</p>
                        <p className="text-gray-500 text-sm">Wishlist Items</p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <item.icon className="text-gray-700" size={22} />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium">{item.label}</p>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                            <MdChevronRight className="text-gray-400" size={24} />
                        </Link>
                    ))}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-medium transition-colors"
                >
                    <MdLogout size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
