import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    MdShoppingCart,
    MdSearch,
    MdMenu,
    MdClose,
    MdPerson,
    MdFavoriteBorder,
    MdFlashOn
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const { wishlist } = useWishlist();
    const { settings } = useSettings();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        { name: 'ACCESSORIES', path: '/shop?category=accessories' },
    ]);

    useEffect(() => {
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
                        setNavLinks(formattedLinks.slice(0, 6)); // Limit to keep it clean
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
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? '' : ''}`}>
            {/* Top Info Bar */}
            <div className="bg-tss-black text-white text-[10px] font-black py-1.5 px-4 flex justify-center items-center gap-4 tracking-widest uppercase">
                <span className="flex items-center gap-1"><MdFlashOn className="text-tss-yellow" /> SHIRT OF THE DAY @ ₹399</span>
                <span className="hidden sm:inline opacity-30">|</span>
                <span className="hidden sm:inline">FREE SHIPPING ON ORDERS ABOVE ₹999</span>
                <span className="hidden sm:inline opacity-30">|</span>
                <Link to="/membership" className="text-tss-yellow hover:underline flex items-center gap-1">
                    BECOME A TRIBE MEMBER
                </Link>
            </div>

            {/* Main Navbar */}
            <div className="bg-white border-b border-gray-100">
                <div className="tss-container">
                    <div className="flex justify-between items-center h-16 md:h-20">

                        {/* Mobile Menu & Logo Group */}
                        <div className="flex items-center gap-2 md:gap-0">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="md:hidden p-2 text-tss-black hover:text-tss-red transition-colors"
                            >
                                <MdMenu size={28} />
                            </button>

                            <Link to="/" className="flex-shrink-0">
                                {settings?.headerLogo ? (
                                    <img src={settings.headerLogo} alt="Logo" className="h-8 md:h-12 w-auto object-contain" />
                                ) : (
                                    <h1 className="text-xl md:text-3xl font-black text-tss-red tracking-tighter">
                                        NAZRA<span className="text-tss-black">KART</span>
                                    </h1>
                                )}
                            </Link>

                            {/* Desktop Gender Switcher */}
                            <div className="hidden lg:flex items-center ml-10 gap-6">
                                {topCategories.map((cat) => (
                                    <Link
                                        key={cat.name}
                                        to={cat.path}
                                        className={`text-[13px] font-black tracking-widest transition-all relative py-2 ${isActive(cat.path)
                                            ? 'text-tss-red after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-tss-red'
                                            : 'text-tss-black/60 hover:text-tss-red'
                                            }`}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar - Centered on Desktop */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <form onSubmit={handleSearch} className="relative w-full group">
                                <input
                                    type="text"
                                    placeholder="Search for products, themes etc."
                                    className="w-full bg-tss-gray-100 h-10 px-4 pr-12 rounded-sm text-sm font-medium border-0 focus:ring-1 focus:ring-tss-red/20 focus:bg-white transition-all outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="absolute right-0 top-0 h-full px-4 text-tss-gray-500 hover:text-tss-red">
                                    <MdSearch size={22} />
                                </button>
                            </form>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 md:gap-6">
                            {/* Profile Dropdown */}
                            <div className="group relative">
                                <button className="p-2 text-tss-black hover:text-tss-red transition-all transform hover:scale-110">
                                    <MdPerson size={26} />
                                </button>
                                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                                    <div className="w-56 bg-white shadow-2xl rounded-sm border border-gray-100 py-3">
                                        {user ? (
                                            <>
                                                <div className="px-5 py-2 border-b border-gray-50 mb-2">
                                                    <p className="text-[10px] text-tss-gray-500 font-bold uppercase tracking-widest mb-1">Account</p>
                                                    <p className="text-sm font-black text-tss-black truncate">{user.name}</p>
                                                </div>
                                                <Link to="/profile" className="block px-5 py-2.5 text-xs font-bold text-tss-gray-500 hover:text-tss-red hover:bg-tss-pink transition-colors">MY PROFILE</Link>
                                                <Link to="/orders" className="block px-5 py-2.5 text-xs font-bold text-tss-gray-500 hover:text-tss-red hover:bg-tss-pink transition-colors">MY ORDERS</Link>
                                                {isAdmin() && (
                                                    <Link to="/admin" className="block px-5 py-2.5 text-xs font-black text-tss-red hover:bg-red-50">ADMIN PANEL</Link>
                                                )}
                                                <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-xs font-bold text-tss-gray-500 hover:text-tss-red hover:bg-tss-pink transition-colors border-t border-gray-50 mt-1">LOGOUT</button>
                                            </>
                                        ) : (
                                            <div className="px-4 py-2">
                                                <Link to="/login" className="tss-button-primary w-full block text-center py-2 text-xs">LOGIN / REGISTER</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Link to="/wishlist" className="p-2 text-tss-black hover:text-tss-red relative transition-all transform hover:scale-110">
                                <MdFavoriteBorder size={26} />
                                {wishlist?.length > 0 && (
                                    <span className="absolute top-1 right-1 bg-tss-red text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-black animate-bounce">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" className="p-2 text-tss-black hover:text-tss-red relative transition-all transform hover:scale-110">
                                <MdShoppingCart size={26} />
                                {getCartCount() > 0 && (
                                    <span className="absolute top-1 right-1 bg-tss-red text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-black">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Sub-Nav Category Strip */}
                    <div className="hidden md:flex justify-center items-center h-10 gap-8 border-t border-gray-50 overflow-x-auto no-scrollbar">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-[11px] font-black text-tss-gray-500 hover:text-tss-red transition-all tracking-[0.15em] whitespace-nowrap"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-tss-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-[85%] max-w-[320px] bg-white h-full flex flex-col shadow-2xl transform transition-transform duration-300 translate-x-0" onClick={e => e.stopPropagation()}>
                        <div className="p-6 bg-tss-red text-white">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black tracking-tighter italic">NAZRAKART</h2>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <MdClose size={24} />
                                </button>
                            </div>
                            {user ? (
                                <div>
                                    <p className="text-[10px] font-black opacity-80 mb-1 tracking-widest uppercase">Welcome back,</p>
                                    <p className="text-lg font-black truncate">{user.name}</p>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="tss-button-primary !bg-white !text-tss-red w-full block text-center py-2.5 text-xs tracking-widest font-black">LOGIN / SIGNUP</Link>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="px-6 mb-6">
                                <p className="text-[10px] font-black text-tss-gray-500 tracking-widest mb-4 uppercase">Categories</p>
                                <div className="space-y-4">
                                    {navLinks.map(link => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-sm font-black text-tss-black hover:text-tss-red transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="px-6 border-t border-gray-100 pt-6">
                                <p className="text-[10px] font-black text-tss-gray-500 tracking-widest mb-4 uppercase">My Account</p>
                                <div className="space-y-4">
                                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold text-tss-black">MY ORDERS</Link>
                                    <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold text-tss-black">MY WISHLIST</Link>
                                    <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold text-tss-black">CONTACT US</Link>
                                    {isAdmin() && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black text-tss-red">ADMIN DASHBOARD</Link>}
                                </div>
                            </div>
                        </div>

                        {user && (
                            <div className="p-6 border-t border-gray-100">
                                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-center py-3 text-xs font-black text-tss-gray-500 border border-tss-gray-200 hover:bg-tss-gray-100 transition-colors uppercase tracking-widest">
                                    LOGOUT
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Space For Fixed Header */}
            <div className={`h-[100px] md:h-[135px] ${scrolled ? '' : ''}`}></div>
        </header>
    );
};

export default Navbar;
