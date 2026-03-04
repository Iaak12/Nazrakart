import React, { useState } from 'react';
import {
    MdSave,
    MdStore,
    MdNotifications,
    MdSecurity,
    MdPayment,
    MdLocalShipping,
    MdPalette,
    MdClose,
    MdInfo,
    MdImage
} from 'react-icons/md';
import { useSettings } from '../../context/SettingsContext';

const AdminSettings = () => {
    const { refreshSettings, applyTheme } = useSettings();
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(null); // 'header' or 'footer'

    const [settings, setSettings] = useState({
        storeName: 'NazraKart',
        storeEmail: 'contact@nazrakart.com',
        storePhone: '+1 (555) 123-4567',
        currency: 'USD',
        timezone: 'America/New_York',
        orderNotifications: true,
        stockAlerts: true,
        emailMarketing: false,
        twoFactorAuth: false,
        primaryColor: '#6366f1',
        darkMode: true,
        headerLogo: '',
        footerLogo: '',
        favicon: '',
        footerDescription: 'Official merchandise. Pop culture heaven. We make cool things for cool people.',
        socialLinks: { facebook: '', twitter: '', instagram: '', linkedin: '' },
        siteTitle: 'NazraKart - Official Merchandise',
        siteDescription: 'Official merchandise. Pop culture heaven. We make cool things for cool people.',
        siteKeywords: 'ecommerce, merchandise, clothing, pop culture',
        razorpay: { enabled: false, keyId: '', keySecret: '' },
        stripe: { enabled: false, publicKey: '', secretKey: '' },
        paypal: { enabled: false, clientId: '', clientSecret: '' },
        upi: { enabled: false, upiId: '', payeeName: '' },
    });

    // Payment modal state
    const [configModal, setConfigModal] = useState({ isOpen: false, method: null });

    const tabs = [
        { id: 'general', label: 'General', icon: MdStore },
        { id: 'notifications', label: 'Notifications', icon: MdNotifications },
        { id: 'security', label: 'Security', icon: MdSecurity },
        { id: 'payments', label: 'Payments', icon: MdPayment },
        { id: 'shipping', label: 'Shipping', icon: MdLocalShipping },
        { id: 'appearance', label: 'Appearance', icon: MdPalette },
        { id: 'headerFooter', label: 'Header & Footer', icon: MdImage },
    ];

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
                if (res.ok) {
                    const data = await res.json();
                    setSettings(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setSaved(true);
                refreshSettings();
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings');
        }
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingImage(type);
            const uploadData = new FormData();
            uploadData.append('image', file);

            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Image upload failed');
            }

            if (type === 'header') {
                handleChange('headerLogo', data.imageUrl);
            } else if (type === 'footer') {
                handleChange('footerLogo', data.imageUrl);
            } else if (type === 'favicon') {
                handleChange('favicon', data.imageUrl);
            }

            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(null);
        }
    };

    const handleChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        if (key === 'primaryColor' || key === 'darkMode') {
            applyTheme(newSettings);
        }
    };

    const handleNestedChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your store configuration</p>
                </div>
                {loading ? (
                    <div className="text-sm font-medium text-gray-500">Loading settings...</div>
                ) : (
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-bold uppercase tracking-widest shadow-md transition-all duration-300 ${saved
                            ? 'bg-green-600 text-white hover:opacity-90'
                            : 'bg-tss-red text-white hover:opacity-90'
                            }`}
                    >
                        <MdSave size={20} />
                        {saved ? 'Saved!' : 'Save Changes'}
                    </button>
                )}
            </div>

            {/* Settings Container */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="rounded-xl bg-white border border-gray-200 p-2 space-y-1 shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all ${activeTab === tab.id
                                    ? 'bg-red-50 text-tss-red font-bold'
                                    : 'text-gray-600 hover:text-tss-red hover:bg-gray-50 font-medium'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1 rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">General Settings</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Store Name</label>
                                    <input
                                        type="text"
                                        value={settings.storeName}
                                        onChange={(e) => handleChange('storeName', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Store Email</label>
                                    <input
                                        type="email"
                                        value={settings.storeEmail}
                                        onChange={(e) => handleChange('storeEmail', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={settings.storePhone}
                                        onChange={(e) => handleChange('storePhone', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Currency</label>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="INR">INR (₹)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Notification Settings</h2>

                            <div className="space-y-4">
                                {[
                                    { key: 'orderNotifications', label: 'Order Notifications', desc: 'Receive alerts when new orders are placed' },
                                    { key: 'stockAlerts', label: 'Stock Alerts', desc: 'Get notified when products are low on stock' },
                                    { key: 'emailMarketing', label: 'Email Marketing', desc: 'Send promotional emails to customers' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-gray-50">
                                        <div>
                                            <p className="text-gray-900 font-bold">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleChange(item.key, !settings[item.key])}
                                            className={`w-14 h-7 rounded-full transition-all duration-300 ${settings[item.key] ? 'bg-tss-red' : 'bg-gray-300'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings[item.key] ? 'translate-x-8' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Security Settings</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-gray-50">
                                    <div>
                                        <p className="text-gray-900 font-bold">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                    </div>
                                    <button
                                        onClick={() => handleChange('twoFactorAuth', !settings.twoFactorAuth)}
                                        className={`w-14 h-7 rounded-full transition-all duration-300 ${settings.twoFactorAuth ? 'bg-tss-red' : 'bg-gray-300'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.twoFactorAuth ? 'translate-x-8' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                <div className="p-4 rounded-md border border-gray-200 bg-gray-50">
                                    <label className="block text-gray-900 font-bold mb-2">Session Timeout (minutes)</label>
                                    <input
                                        type="number"
                                        value={settings.sessionTimeout}
                                        onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                    />
                                </div>

                                <button className="w-full py-3 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md font-bold uppercase tracking-widest transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Payment Settings */}
                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Payment Settings</h2>

                            <div className="space-y-4">
                                {['Razorpay', 'Stripe', 'PayPal', 'UPI'].map((method) => {
                                    const methodKey = method.toLowerCase();
                                    const isEnabled = settings[methodKey]?.enabled;

                                    return (
                                        <div key={method} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md border ${isEnabled ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                            <div className="flex items-center gap-3 mb-4 sm:mb-0">
                                                <div className="w-10 h-10 rounded-md bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                                    <MdPayment className={isEnabled ? "text-green-600" : "text-tss-red"} />
                                                </div>
                                                <div>
                                                    <p className="text-gray-900 font-bold">{method}</p>
                                                    <p className={`text-xs font-bold uppercase tracking-wider ${isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {isEnabled ? 'Enabled' : 'Disabled'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setConfigModal({ isOpen: true, method: methodKey })}
                                                className="px-4 py-2 text-sm text-gray-700 hover:text-tss-red hover:bg-red-50 rounded-md transition-colors font-bold uppercase tracking-widest border border-gray-200 bg-white"
                                            >
                                                Configure
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Shipping Settings */}
                    {activeTab === 'shipping' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Shipping Settings</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Free Shipping Threshold (₹)</label>
                                    <input
                                        type="number"
                                        value={settings.freeShippingThreshold}
                                        onChange={(e) => handleChange('freeShippingThreshold', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Default Shipping Rate (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={settings.defaultShippingRate}
                                        onChange={(e) => handleChange('defaultShippingRate', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Appearance Settings</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">Primary Color</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={settings.primaryColor}
                                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                                            className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                        />
                                        <input
                                            type="text"
                                            value={settings.primaryColor}
                                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                                            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-gray-50">
                                    <div>
                                        <p className="text-gray-900 font-bold">Dark Mode</p>
                                        <p className="text-sm text-gray-500">Use dark theme for admin panel</p>
                                    </div>
                                    <button
                                        onClick={() => handleChange('darkMode', !settings.darkMode)}
                                        className={`w-14 h-7 rounded-full transition-all duration-300 ${settings.darkMode ? 'bg-tss-red' : 'bg-gray-300'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.darkMode ? 'translate-x-8' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header & Footer Settings */}
                    {activeTab === 'headerFooter' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 mb-6">Logo Configuration</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Header Logo */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">Header Logo</label>
                                        <div className="w-full aspect-[3/1] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:bg-gray-100 transition-colors relative">
                                            {settings.headerLogo ? (
                                                <>
                                                    <img src={settings.headerLogo} alt="Header Logo" className="w-full h-full object-contain mb-4" />
                                                    <button type="button" onClick={() => handleChange('headerLogo', '')} className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 shadow-sm border border-gray-200">
                                                        <MdClose size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-gray-400 flex flex-col items-center">
                                                    <MdImage size={40} className="mb-2" />
                                                    <p className="text-sm font-medium">Click to upload header logo</p>
                                                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleImageUpload(e, 'header')}
                                                disabled={uploadingImage === 'header'}
                                            />
                                            {uploadingImage === 'header' && (
                                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tss-red"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Logo */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">Footer Logo</label>
                                        <div className="w-full aspect-[3/1] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:bg-gray-100 transition-colors relative">
                                            {settings.footerLogo ? (
                                                <>
                                                    <img src={settings.footerLogo} alt="Footer Logo" className="w-full h-full object-contain mb-4" />
                                                    <button type="button" onClick={() => handleChange('footerLogo', '')} className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 shadow-sm border border-gray-200">
                                                        <MdClose size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-gray-400 flex flex-col items-center">
                                                    <MdImage size={40} className="mb-2" />
                                                    <p className="text-sm font-medium">Click to upload footer logo</p>
                                                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleImageUpload(e, 'footer')}
                                                disabled={uploadingImage === 'footer'}
                                            />
                                            {uploadingImage === 'footer' && (
                                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tss-red"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Favicon (Browser Tab Icon)</h3>
                                    <div className="w-full md:w-1/2 aspect-[3/1] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:bg-gray-100 transition-colors relative">
                                        {settings.favicon ? (
                                            <>
                                                <img src={settings.favicon} alt="Favicon Logo" className="w-16 h-16 object-contain mb-4" />
                                                <button type="button" onClick={() => handleChange('favicon', '')} className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 shadow-sm border border-gray-200">
                                                    <MdClose size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-gray-400 flex flex-col items-center">
                                                <MdImage size={40} className="mb-2" />
                                                <p className="text-sm font-medium">Click to upload favicon</p>
                                                <p className="text-xs mt-1">PNG, JPG, ICO, SVG up to 1MB</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*,.ico,image/svg+xml"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleImageUpload(e, 'favicon')}
                                            disabled={uploadingImage === 'favicon'}
                                        />
                                        {uploadingImage === 'favicon' && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tss-red"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 mb-6">Global SEO Meta Tags</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Site Title</label>
                                        <input
                                            type="text"
                                            value={settings.siteTitle || ''}
                                            onChange={(e) => handleChange('siteTitle', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                            placeholder="e.g. NazraKart - Official Merchandise"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Site Description</label>
                                        <textarea
                                            value={settings.siteDescription || ''}
                                            onChange={(e) => handleChange('siteDescription', e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium resize-none"
                                            placeholder="Brief description of the site for search engines..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Site Keywords</label>
                                        <input
                                            type="text"
                                            value={settings.siteKeywords || ''}
                                            onChange={(e) => handleChange('siteKeywords', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                            placeholder="e.g. ecommerce, clothing, accessories (comma separated)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 mb-6">Footer Content</h2>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">Footer Description</label>
                                    <textarea
                                        value={settings.footerDescription || ''}
                                        onChange={(e) => handleChange('footerDescription', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium resize-none"
                                        placeholder="Enter brand description for footer..."
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 mb-6">Social Links</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                        <div key={social}>
                                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">{social} URL</label>
                                            <input
                                                type="url"
                                                value={settings.socialLinks?.[social] || ''}
                                                onChange={(e) => handleNestedChange('socialLinks', social, e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-medium"
                                                placeholder={`https://${social}.com/...`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Configuration Modal */}
            {configModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setConfigModal({ isOpen: false, method: null })} />
                    <div className="relative w-full max-w-lg bg-white rounded-xl flex flex-col shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <MdPayment className="text-tss-red" />
                                Configure {configModal.method.toUpperCase()}
                            </h2>
                            <button
                                onClick={() => setConfigModal({ isOpen: false, method: null })}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-md">
                                <div>
                                    <p className="font-bold text-gray-900">Enable {configModal.method.toUpperCase()}</p>
                                    <p className="text-sm text-gray-500">Allow customers to pay using this gateway</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings[configModal.method]?.enabled || false}
                                        onChange={(e) => handleNestedChange(configModal.method, 'enabled', e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>

                            <div className="space-y-4">
                                {configModal.method === 'razorpay' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Key ID</label>
                                            <input
                                                type="text"
                                                value={settings.razorpay?.keyId || ''}
                                                onChange={(e) => handleNestedChange('razorpay', 'keyId', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder="rzp_test_..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Key Secret</label>
                                            <input
                                                type="password"
                                                value={settings.razorpay?.keySecret || ''}
                                                onChange={(e) => handleNestedChange('razorpay', 'keySecret', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder="Enter Razorpay Core Secret"
                                            />
                                        </div>
                                    </>
                                )}

                                {configModal.method === 'stripe' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Publishable Key / Public Key</label>
                                            <input
                                                type="text"
                                                value={settings.stripe?.publicKey || ''}
                                                onChange={(e) => handleNestedChange('stripe', 'publicKey', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder="pk_test_..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Secret Key</label>
                                            <input
                                                type="password"
                                                value={settings.stripe?.secretKey || ''}
                                                onChange={(e) => handleNestedChange('stripe', 'secretKey', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder="sk_test_..."
                                            />
                                        </div>
                                    </>
                                )}

                                {configModal.method === 'paypal' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Client ID</label>
                                            <input
                                                type="text"
                                                value={settings.paypal?.clientId || ''}
                                                onChange={(e) => handleNestedChange('paypal', 'clientId', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder="Enter PayPal Client ID"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Client Secret</label>
                                            <input
                                                type="password"
                                                value={settings.paypal?.clientSecret || ''}
                                                onChange={(e) => handleNestedChange('paypal', 'clientSecret', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder="Enter PayPal Client Secret"
                                            />
                                        </div>
                                    </>
                                )}

                                {configModal.method === 'upi' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Business UPI ID</label>
                                            <input
                                                type="text"
                                                value={settings.upi?.upiId || ''}
                                                onChange={(e) => handleNestedChange('upi', 'upiId', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder="e.g. yourbusiness@ybl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Payee Name</label>
                                            <input
                                                type="text"
                                                value={settings.upi?.payeeName || ''}
                                                onChange={(e) => handleNestedChange('upi', 'payeeName', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder="e.g. NazraKart Store"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <p className="text-xs text-gray-500 italic flex items-center gap-2">
                                <MdInfo className="text-blue-500" size={16} /> Data is secured and injected dynamically for transactions. Don't forget to press "Save Changes" on the main page after updating.
                            </p>

                            <button
                                type="button"
                                onClick={() => setConfigModal({ isOpen: false, method: null })}
                                className="w-full py-3 px-4 bg-gray-900 text-white rounded-md font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
