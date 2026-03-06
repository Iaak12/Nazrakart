import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdShoppingBag, MdSettings, MdLogout, MdChevronRight, MdFavorite, MdLocationOn, MdCardMembership, MdFlashOn } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { icon: MdShoppingBag, label: 'My Orders', desc: 'Check status of your orders', link: '/orders' },
        { icon: MdFavorite, label: 'My Wishlist', desc: 'Your saved favorite items', link: '/wishlist' },
        { icon: MdLocationOn, label: 'My Addresses', desc: 'Manage your delivery addresses', link: '/settings' },
        { icon: MdSettings, label: 'Account Settings', desc: 'Profile, password & preferences', link: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Profile Header */}
            <div className="bg-tss-gray-100 py-12 border-b border-tss-gray-200 mb-12">
                <div className="tss-container">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-full bg-tss-black flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-black text-tss-black uppercase tracking-[0.1em] mb-1">{user?.name}</h1>
                            <p className="text-tss-gray-400 font-bold flex items-center justify-center md:justify-start gap-2 uppercase tracking-widest text-[12px]">
                                <MdEmail size={16} />
                                {user?.email}
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user?.isTriBeMember ? 'bg-tss-green text-white border-tss-green' : 'bg-white text-tss-gray-400 border-tss-gray-200'
                                    }`}>
                                    {user?.isTriBeMember ? 'TriBe Member' : 'Regular Member'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 border-2 border-tss-gray-200 text-tss-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-tss-red hover:text-tss-red transition-all flex items-center gap-2"
                        >
                            <MdLogout size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="tss-container">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Menu Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.link}
                                className="group p-8 border border-tss-gray-100 rounded-sm hover:shadow-xl hover:border-tss-red transition-all duration-300 bg-white relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-sm bg-tss-gray-50 flex items-center justify-center mb-6 group-hover:bg-tss-red group-hover:text-white transition-colors">
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="text-[14px] font-black text-tss-black uppercase tracking-widest mb-1">{item.label}</h3>
                                    <p className="text-[11px] font-bold text-tss-gray-400 uppercase tracking-wider">{item.desc}</p>
                                </div>
                                <MdChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-tss-gray-200 group-hover:text-tss-red group-hover:right-4 transition-all" size={24} />
                            </Link>
                        ))}
                    </div>

                    {/* Right: Membership Card */}
                    <aside>
                        {!user?.isTriBeMember ? (
                            <div className="bg-tss-black text-white p-8 rounded-sm relative overflow-hidden shadow-2xl group">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6 text-tss-red">
                                        <MdFlashOn size={24} />
                                        <span className="font-black uppercase tracking-[0.2em] text-[14px]">The TriBe</span>
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-widest mb-4 leading-tight">BECOME A MEMBER & SAVE EXTRA</h2>
                                    <ul className="space-y-3 mb-8">
                                        {[
                                            'Extra 10% discount on all products',
                                            'Free shipping on all orders',
                                            'Early access to new launches',
                                            'Exclusive member-only collections'
                                        ].map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[11px] font-bold uppercase tracking-wider opacity-80">
                                                <MdCheck className="text-tss-green flex-shrink-0 mt-0.5" size={14} />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-4 bg-tss-red text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-sm hover:bg-red-700 transition-all shadow-xl active:scale-95">
                                        JOIN TRIBE NOW
                                    </button>
                                </div>
                                <div className="absolute -right-10 -bottom-10 text-white/5 rotate-12 group-hover:scale-110 transition-transform">
                                    <MdCardMembership size={200} />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-[#117a7a] to-[#0d5c5c] text-white p-8 rounded-sm relative overflow-hidden shadow-2xl">
                                <div className="relative z-10">
                                    <h2 className="text-xl font-black uppercase tracking-widest mb-6">Hello, TriBe Member!</h2>
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-sm border border-white/20">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Total Savings</p>
                                        <p className="text-3xl font-black">{formatPrice(1250)}</p>
                                    </div>
                                    <p className="text-[11px] font-bold mt-6 opacity-80 uppercase tracking-widest leading-loose">
                                        Your membership is active. Keep shopping to unlock more exclusive deals and early access.
                                    </p>
                                </div>
                                <MdCardMembership size={150} className="absolute -right-8 -bottom-8 opacity-10" />
                            </div>
                        )}

                        <div className="mt-8 p-6 bg-tss-gray-50 rounded-sm border border-tss-gray-200">
                            <h3 className="text-[12px] font-black text-tss-black uppercase tracking-widest mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <Link to="/faq" className="block text-[11px] font-bold text-tss-gray-500 uppercase tracking-widest hover:text-tss-red">Need Help? Visit FAQ</Link>
                                <Link to="/contact" className="block text-[11px] font-bold text-tss-gray-500 uppercase tracking-widest hover:text-tss-red">Contact Support</Link>
                                <Link to="/returns" className="block text-[11px] font-bold text-tss-gray-500 uppercase tracking-widest hover:text-tss-red">Return Policy</Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Profile;
