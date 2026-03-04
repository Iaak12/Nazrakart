import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebookF } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
    const { settings } = useSettings();
    return (
        <footer className="bg-[#f0f0f0] border-t-4 border-tss-red pt-16 mt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 w-max">
                            {settings?.footerLogo ? (
                                <img src={settings.footerLogo} alt="Footer Logo" className="h-[40px] w-auto object-contain" />
                            ) : (
                                <span className="text-3xl font-extrabold text-tss-red tracking-tighter uppercase font-['Inter']">
                                    {settings?.storeName ? settings.storeName.toUpperCase() : (
                                        <>NAZRA<span className="text-gray-900">KART</span></>
                                    )}
                                </span>
                            )}
                        </Link>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed max-w-sm">
                            {settings?.footerDescription || 'Official merchandise. Pop culture heaven. We make cool things for cool people.'}
                        </p>

                        <div className="pt-2">
                            <p className="font-bold text-gray-900 mb-2">FOLLOW US</p>
                            <div className="flex items-center gap-3">
                                {settings?.socialLinks?.facebook && (
                                    <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-white hover:bg-tss-red transition-all shadow-sm">
                                        <FaFacebookF size={18} />
                                    </a>
                                )}
                                {settings?.socialLinks?.twitter && (
                                    <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-white hover:bg-tss-red transition-all shadow-sm">
                                        <FaTwitter size={18} />
                                    </a>
                                )}
                                {settings?.socialLinks?.instagram && (
                                    <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-white hover:bg-tss-red transition-all shadow-sm">
                                        <FaInstagram size={18} />
                                    </a>
                                )}
                                {settings?.socialLinks?.linkedin && (
                                    <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-white hover:bg-tss-red transition-all shadow-sm">
                                        <FaLinkedin size={18} />
                                    </a>
                                )}
                                {/* Render default dummy links if no social links setup to keep layout nice */}
                                {(!settings?.socialLinks?.facebook && !settings?.socialLinks?.twitter && !settings?.socialLinks?.instagram && !settings?.socialLinks?.linkedin) && (
                                    <>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-white hover:bg-tss-red transition-all shadow-sm">
                                            <FaFacebookF size={18} />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-white hover:bg-tss-red transition-all shadow-sm">
                                            <FaTwitter size={18} />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-white hover:bg-tss-red transition-all shadow-sm">
                                            <FaInstagram size={18} />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-white hover:bg-tss-red transition-all shadow-sm">
                                            <FaLinkedin size={18} />
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-tss-red font-bold tracking-wider uppercase mb-6">Need Help?</h3>
                        <ul className="space-y-3">
                            <li><Link to="/contact" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">Contact Us</Link></li>
                            <li><Link to="/shop" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">Shop</Link></li>
                            <li><Link to="/faq" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">FAQ</Link></li>
                            <li><Link to="/shipping" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">Track Order</Link></li>
                            <li><Link to="/returns" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">Return Policy</Link></li>
                            <li><Link to="/profile" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">My Account</Link></li>
                            <li><Link to="/wishlist" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">My Wishlist</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-tss-red font-bold tracking-wider uppercase mb-6">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">About Us</Link></li>
                            <li><Link to="/careers" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">Careers</Link></li>
                            <li><Link to="/stores" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">Stores</Link></li>
                            <li><Link to="/terms" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className="text-gray-600 font-medium hover:text-tss-red transition-colors text-sm">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* App Links (Mock) */}
                    <div>
                        <h3 className="text-tss-red font-bold tracking-wider uppercase mb-6">Experience Nazrakart</h3>
                        <div className="space-y-4">
                            <button className="w-full bg-gray-900 border border-gray-900 text-white rounded-md px-4 py-2 font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                Download Android App
                            </button>
                            <button className="w-full bg-white border border-gray-300 text-gray-900 rounded-md px-4 py-2 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                Download iOS App
                            </button>
                        </div>
                    </div>
                </div>

                {/* 100% Secure Strip */}
                <div className="border-t border-b border-gray-200 py-6 mb-8 flex flex-col md:flex-row items-center justify-center md:justify-around gap-4 text-center">
                    <div className="flex items-center gap-2">
                        <span className="text-tss-success font-black text-2xl">✓</span>
                        <span className="text-gray-700 font-bold uppercase tracking-wider text-xs">100% Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-tss-success font-black text-2xl">✓</span>
                        <span className="text-gray-700 font-bold uppercase tracking-wider text-xs">Free Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-tss-success font-black text-2xl">✓</span>
                        <span className="text-gray-700 font-bold uppercase tracking-wider text-xs">Cash on Delivery</span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-gray-500 font-medium text-xs">NazraKart © 2026. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
