import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    MdShoppingCart,
    MdSearch,
    MdMenu,
    MdClose,
    MdPerson,
    MdFavoriteBorder
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const { wishlist } = useWishlist();
    const { settings } = useSettings();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const [navLinks, setNavLinks] = useState([
        { name: 'TOP WEAR', path: '/shop?category=topwear' },
        { name: 'BOTTOM WEAR', path: '/shop?category=bottomwear' },
        { name: 'SNEAKERS', path: '/shop?category=sneakers' },
        { name: 'ACCESSORIES', path: '/shop?category=accessories' },
        { name: 'COLLECTIONS', path: '/shop?category=collections' },
    ]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const formattedLinks = data.map(cat => ({
                            name: cat.name.toUpperCase(),
                            path: `/shop?category=${cat.slug || cat.name.toLowerCase()}`
                        }));
                        setNavLinks(formattedLinks);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch categories for navbar:", error);
            }
        };
        fetchCategories();
    }, []);

    const topCategories = [
        { name: 'MEN', path: '/shop?gender=Men' },
        { name: 'WOMEN', path: '/shop?gender=Women' },
        { name: 'KIDS', path: '/shop?gender=Kids' },
    ];

    const isActive = (path) => location.pathname + location.search === path;

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm flex flex-col font-roboto">
            {/* Top Offers Strip */}
            <div className="bg-tss-red text-white text-[11px] font-bold py-2 px-4 text-center tracking-widest uppercase cursor-pointer hover:underline">
                DOWNLOAD APP & GET 10% OFF ON YOUR FIRST ORDER!
            </div>

            {/* Main Navbar */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-[70px]">

                        {/* Mobile Menu Icon */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-800"
                        >
                            {isMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
                        </button>

                        {/* Top Gender Categories (Desktop only) */}
                        <div className="hidden md:flex gap-8 items-center flex-1">
                            {topCategories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    to={cat.path}
                                    className={`text-[13px] font-bold tracking-widest uppercase transition-colors ${isActive(cat.path) ? 'text-tss-black border-b-2 border-tss-red pb-1' : 'text-gray-500 hover:text-tss-black'
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center justify-center">
                            {settings?.headerLogo ? (
                                <img src={settings.headerLogo} alt="Store Logo" className="h-[40px] w-auto object-contain" />
                            ) : (
                                <span className="text-2xl font-black text-tss-red tracking-tighter uppercase font-ubuntu">
                                    {settings?.storeName ? settings.storeName.toUpperCase() : (
                                        <>NAZRA<span className="text-tss-black">KART</span></>
                                    )}
                                </span>
                            )}
                        </Link>

                        {/* Right Section: Search & Icons */}
                        <div className="flexitems-center justify-end gap-6 flex-1 flex">

                            {/* Search (Desktop) */}
                            <form onSubmit={handleSearch} className="hidden lg:block relative text-gray-600">
                                <input
                                    className="bg-[#f5f5f5] h-9 px-4 pr-10 rounded-sm text-sm focus:outline-none w-[200px] border border-transparent focus:border-gray-300 transition-colors"
                                    type="text"
                                    placeholder="What are you looking for?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="absolute right-0 top-0 mt-[8px] mr-3">
                                    <MdSearch size={20} className="text-gray-500 hover:text-tss-red transition-colors" />
                                </button>
                            </form>

                            {/* Mobile Search Icon */}
                            <button className="lg:hidden p-2 text-gray-800 hover:text-tss-red">
                                <MdSearch size={24} />
                            </button>

                            {/* Divider */}
                            <div className="hidden lg:block h-6 w-px bg-gray-200"></div>

                            {/* Profile / Auth */}
                            <div className="group relative">
                                <button className="p-1 text-gray-700 hover:text-tss-red flex items-center transition-colors">
                                    <MdPerson size={24} />
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 font-roboto">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 font-medium">Hello, {user.name}</div>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-tss-red">My Profile</Link>
                                            <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-tss-red">My Orders</Link>
                                            {isAdmin() && (
                                                <Link to="/admin" className="block px-4 py-2 text-sm text-tss-red font-bold hover:bg-red-50">Admin Dashboard</Link>
                                            )}
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-tss-red">Log Out</button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-tss-red font-medium">Log In / Register</Link>
                                            <Link to="/admin" className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-tss-red">Admin Login</Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Wishlist */}
                            <Link to="/wishlist" className="p-1 text-gray-700 hover:text-tss-red relative hidden sm:flex items-center transition-colors">
                                <MdFavoriteBorder size={24} />
                                {wishlist?.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-tss-red text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="p-1 text-gray-700 hover:text-tss-red relative flex items-center transition-colors">
                                <MdShoppingCart size={24} />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-tss-red text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Menu Strip (Desktop) */}
            <div className="hidden lg:block shadow-sm z-40 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-10 h-[50px]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-[13px] font-bold text-gray-800 hover:text-tss-red transition-colors tracking-wide uppercase font-ubuntu"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="w-4/5 max-w-sm bg-white h-full flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile User Header */}
                        <div className="bg-gray-50 p-6 border-b flex items-center justify-between">
                            {user ? (
                                <div>
                                    <p className="text-lg font-bold text-gray-900">Hi, {user.name.split(' ')[0]}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-tss-red">Log In / Sign Up</Link>
                            )}
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-200 rounded-full text-gray-600">
                                <MdClose size={20} />
                            </button>
                        </div>

                        {/* Mobile Primary Categories */}
                        <div className="flex border-b border-gray-100">
                            {topCategories.map(cat => (
                                <Link
                                    key={cat.name}
                                    to={cat.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex-1 py-3 text-center border-r last:border-0 font-bold text-sm text-gray-700 hover:bg-gray-50 hover:text-tss-red uppercase"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Links */}
                        <div className="flex-1 overflow-y-auto pt-4 pb-20">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-6 py-4 text-base font-semibold text-gray-800 hover:bg-gray-50 border-b border-gray-50"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-base font-semibold text-gray-800 hover:bg-gray-50 border-b border-gray-50">
                                Contact Us
                            </Link>

                            {isAdmin() && (
                                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-base font-bold text-tss-red bg-red-50 mb-2">
                                    Admin Panel
                                </Link>
                            )}

                            {user && (
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="w-full text-left px-6 py-4 text-base font-semibold text-gray-500 hover:bg-gray-50"
                                >
                                    Log Out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
