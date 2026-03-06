import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdLocationOn, MdSecurity, MdRotateLeft, MdLocalShipping } from 'react-icons/md';
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebookF, FaYoutube, FaGooglePlay, FaApple } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
    const { settings } = useSettings();
    return (
        <footer className="bg-tss-gray-100 mt-20">
            {/* Top Benefits Strip */}
            <div className="bg-white border-y border-gray-100 py-10">
                <div className="tss-container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center justify-center gap-4 group">
                            <div className="w-12 h-12 bg-tss-gray-100 rounded-full flex items-center justify-center text-tss-black group-hover:bg-tss-red group-hover:text-white transition-all duration-300">
                                <MdLocalShipping size={24} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black tracking-widest">FREE DELIVERY</h4>
                                <p className="text-[10px] text-tss-gray-500 font-bold uppercase transition-colors group-hover:text-tss-red">On all orders above ₹999</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 group">
                            <div className="w-12 h-12 bg-tss-gray-100 rounded-full flex items-center justify-center text-tss-black group-hover:bg-tss-red group-hover:text-white transition-all duration-300">
                                <MdRotateLeft size={24} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black tracking-widest">EASY RETURNS</h4>
                                <p className="text-[10px] text-tss-gray-500 font-bold uppercase transition-colors group-hover:text-tss-red">30-day return policy</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 group">
                            <div className="w-12 h-12 bg-tss-gray-100 rounded-full flex items-center justify-center text-tss-black group-hover:bg-tss-red group-hover:text-white transition-all duration-300">
                                <MdSecurity size={24} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black tracking-widest">100% SECURE</h4>
                                <p className="text-[10px] text-tss-gray-500 font-bold uppercase transition-colors group-hover:text-tss-red">Safe & Secure Payments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tss-container py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6 text-center md:text-left">
                        <Link to="/" className="inline-block">
                            {settings?.footerLogo ? (
                                <img src={settings.footerLogo} alt="Logo" className="h-10 w-auto object-contain" />
                            ) : (
                                <h2 className="text-2xl font-black text-tss-red tracking-tighter">
                                    NAZRA<span className="text-tss-black">KART</span>
                                </h2>
                            )}
                        </Link>
                        <p className="text-xs text-tss-gray-500 font-bold leading-6 uppercase tracking-wider">
                            {settings?.footerDescription || 'Official merchandise. Pop culture heaven. We make cool things for cool people who love the extraordinary.'}
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-tss-black hover:bg-tss-red hover:text-white transition-all shadow-sm"><FaFacebookF /></a>
                            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-tss-black hover:bg-tss-red hover:text-white transition-all shadow-sm"><FaInstagram /></a>
                            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-tss-black hover:bg-tss-red hover:text-white transition-all shadow-sm"><FaTwitter /></a>
                            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-tss-black hover:bg-tss-red hover:text-white transition-all shadow-sm"><FaYoutube /></a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-black tracking-widest mb-8 border-l-4 border-tss-red pl-4">NEED HELP?</h3>
                        <ul className="space-y-4">
                            <li><Link to="/contact" className="text-xs font-black text-tss-gray-500 hover:text-tss-red transition-colors tracking-widest uppercase">Contact Us</Link></li>
                            <li><Link to="/faq" className="text-xs font-black text-tss-gray-500 hover:text-tss-red transition-colors tracking-widest uppercase">FAQ</Link></li>
                            <li><Link to="/returns" className="text-xs font-black text-tss-gray-500 hover:text-tss-red transition-colors tracking-widest uppercase">Returns & Exchanges</Link></li>
                            <li><Link to="/shipping" className="text-xs font-black text-tss-gray-500 hover:text-tss-red transition-colors tracking-widest uppercase">Shipping Policy</Link></li>
                            <li><Link to="/track" className="text-xs font-black text-tss-gray-500 hover:text-tss-red transition-colors tracking-widest uppercase">Track Order</Link></li>
                        </ul>
                    </div>

                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-black tracking-widest mb-8 border-l-4 border-tss-red pl-4 uppercase">Company</h3>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-xs font-black text-tss-gray-500 hover:text-tss-red transition-colors tracking-widest uppercase">About Us</Link></li>
                            <li><Link to="/careers" className="text-xs font-black text-tss-gray-500 hover:text-tss-red transition-colors tracking-widest uppercase">Careers</Link></li>
                            <li><Link to="/terms" className="text-xs font-black text-tss-gray-500 hover:text-tss-red transition-colors tracking-widest uppercase">Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className="text-xs font-black text-tss-gray-500 hover:text-tss-red transition-colors tracking-widest uppercase">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Download Section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-black tracking-widest mb-8 border-l-4 border-tss-red pl-4 uppercase">Experience Store</h3>
                        <div className="space-y-4">
                            <a href="#" className="flex items-center gap-3 bg-tss-black text-white px-4 py-2.5 rounded hover:bg-tss-red transition-all group">
                                <FaGooglePlay size={20} className="group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <p className="text-[8px] font-bold opacity-70">GET IT ON</p>
                                    <p className="text-[10px] font-black tracking-wider">Google Play</p>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-3 bg-tss-black text-white px-4 py-2.5 rounded hover:bg-tss-red transition-all group">
                                <FaApple size={24} className="group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <p className="text-[8px] font-bold opacity-70">Download on the</p>
                                    <p className="text-[10px] font-black tracking-wider">App Store</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="bg-tss-black py-4">
                <div className="tss-container flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">
                        NazraKart © 2026. Official Merchandise Store.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">Secure Payments</span>
                        <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
                            {/* Standard Payment Method Placeholders */}
                            <div className="w-8 h-5 bg-white rounded-sm"></div>
                            <div className="w-8 h-5 bg-white rounded-sm"></div>
                            <div className="w-8 h-5 bg-white rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
