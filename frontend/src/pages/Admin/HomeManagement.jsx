import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdSave, MdAdd, MdDelete, MdDragIndicator } from 'react-icons/md';
import HeadingSelector from '../../components/Admin/HeadingSelector';

const HomeManagement = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('banners'); // banners, categories, franchises, seo
    const [uploadingField, setUploadingField] = useState(null);

    const [formData, setFormData] = useState({
        banners: [],
        categories: [],
        franchises: [],
        seo: {
            home: { metaTitle: '', metaDescription: '', metaKeywords: '' },
            about: { metaTitle: '', metaDescription: '', metaKeywords: '' },
            contact: { metaTitle: '', metaDescription: '', metaKeywords: '' },
            shop: { metaTitle: '', metaDescription: '', metaKeywords: '' },
            faq: { metaTitle: '', metaDescription: '', metaKeywords: '' },
            careers: { metaTitle: '', metaDescription: '', metaKeywords: '' }
        }
    });

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/home`);
            const data = await res.json();

            if (res.ok) {
                setFormData({
                    banners: data.banners || [],
                    categories: data.categories || [],
                    franchises: data.franchises || [],
                    seo: data.seo || formData.seo
                });
            }
        } catch (error) {
            console.error('Failed to fetch Home Data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeArray = (tab, index, field, value) => {
        const newArray = [...formData[tab]];
        newArray[index] = { ...newArray[index], [field]: value };
        setFormData(prev => ({ ...prev, [tab]: newArray }));
    };

    const handleSeoChange = (page, field, value) => {
        setFormData(prev => ({
            ...prev,
            seo: {
                ...prev.seo,
                [page]: {
                    ...prev.seo[page],
                    [field]: value
                }
            }
        }));
    };

    const addItem = (tab) => {
        let newItem = {};
        if (tab === 'banners') newItem = { image: '', mobileImage: '', link: '', alt: 'New Banner', title: '', titleTag: 'h2' };
        if (tab === 'categories') newItem = { name: 'New Category', image: '', path: '', nameTag: 'span' };
        if (tab === 'franchises') newItem = { name: 'New franchise', image: '', bgImage: '', path: '', color: 'from-gray-900 to-black', nameTag: 'h3' };

        setFormData(prev => ({
            ...prev,
            [tab]: [...prev[tab], newItem]
        }));
    };

    const removeItem = (tab, index) => {
        const newArray = [...formData[tab]];
        newArray.splice(index, 1);
        setFormData(prev => ({ ...prev, [tab]: newArray }));
    };

    const handleImageUpload = async (e, tab, index, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploadingField(`${tab}-${index}-${field}`);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                body: uploadData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Image upload failed');
            }

            handleChangeArray(tab, index, field, data.imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        } finally {
            setUploadingField(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/home`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Home page updated successfully!');
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to update');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Server error while saving.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Home Page data...</div>;

    return (
        <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Home Page Management</h1>
                        <p className="text-gray-500 mt-1 font-medium">Manage Hero Banners, Category Circles, and Franchises Grids</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-tss-red text-white rounded-md font-bold hover:bg-red-700 transition-all uppercase tracking-widest text-sm shadow-md disabled:opacity-50"
                    >
                        <MdSave size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
                    {['banners', 'categories', 'franchises', 'seo'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === tab
                                ? 'border-b-2 border-tss-red text-tss-red'
                                : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                            {activeTab === 'seo' ? 'Manage Global SEO Meta Tags' : `Manage ${activeTab}`}
                        </h2>
                        {activeTab !== 'seo' && (
                            <button
                                type="button"
                                onClick={() => addItem(activeTab)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold uppercase rounded hover:bg-gray-800 transition-colors"
                            >
                                <MdAdd size={18} /> Add New
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {activeTab !== 'seo' && formData[activeTab].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group flex gap-4">
                                <div className="text-gray-300 cursor-move pt-2 flex-shrink-0">
                                    <MdDragIndicator size={24} />
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeTab === 'banners' && (
                                        <>
                                            <div className="col-span-1 md:col-span-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Banner Title (Optional)</label>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[8px] uppercase font-black text-gray-400">Tag:</span>
                                                        <HeadingSelector
                                                            value={item.titleTag || 'h2'}
                                                            onChange={(e) => handleChangeArray(activeTab, index, 'titleTag', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={item.title || ''}
                                                    onChange={(e) => handleChangeArray(activeTab, index, 'title', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    placeholder="e.g. SUMMER COLLECTION"
                                                />
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Desktop Image URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={item.image}
                                                        onChange={(e) => handleChangeArray(activeTab, index, 'image', e.target.value)}
                                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                        placeholder="1500x... px image"
                                                    />
                                                    <label className="flex items-center justify-center px-4 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition-colors whitespace-nowrap">
                                                        <span className="text-xs font-bold uppercase">{uploadingField === `banners-${index}-image` ? 'UP...' : 'UPLOAD'}</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banners', index, 'image')} disabled={uploadingField !== null} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mobile Image URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={item.mobileImage}
                                                        onChange={(e) => handleChangeArray(activeTab, index, 'mobileImage', e.target.value)}
                                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                        placeholder="480x... px image"
                                                    />
                                                    <label className="flex items-center justify-center px-4 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition-colors whitespace-nowrap">
                                                        <span className="text-xs font-bold uppercase">{uploadingField === `banners-${index}-mobileImage` ? 'UP...' : 'UPLOAD'}</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banners', index, 'mobileImage')} disabled={uploadingField !== null} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link Path</label>
                                                <input
                                                    type="text"
                                                    value={item.link}
                                                    onChange={(e) => handleChangeArray(activeTab, index, 'link', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    placeholder="e.g. /shop?theme=Marvel"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alt Text (SEO)</label>
                                                <input
                                                    type="text"
                                                    value={item.alt}
                                                    onChange={(e) => handleChangeArray(activeTab, index, 'alt', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'categories' && (
                                        <>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Display Name</label>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[8px] uppercase font-black text-gray-400">Tag:</span>
                                                        <HeadingSelector
                                                            value={item.nameTag || 'span'}
                                                            onChange={(e) => handleChangeArray(activeTab, index, 'nameTag', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleChangeArray(activeTab, index, 'name', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    placeholder="e.g. SHIRTS"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link Path</label>
                                                <input
                                                    type="text"
                                                    value={item.path}
                                                    onChange={(e) => handleChangeArray(activeTab, index, 'path', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    placeholder="e.g. /shop?category=shirts"
                                                />
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image URL (Circle)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={item.image}
                                                        onChange={(e) => handleChangeArray(activeTab, index, 'image', e.target.value)}
                                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    />
                                                    <label className="flex items-center justify-center px-4 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition-colors whitespace-nowrap">
                                                        <span className="text-xs font-bold uppercase">{uploadingField === `categories-${index}-image` ? 'UP...' : 'UPLOAD'}</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'categories', index, 'image')} disabled={uploadingField !== null} />
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'franchises' && (
                                        <>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Franchise Name</label>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[8px] uppercase font-black text-gray-400">Tag:</span>
                                                        <HeadingSelector
                                                            value={item.nameTag || 'h3'}
                                                            onChange={(e) => handleChangeArray(activeTab, index, 'nameTag', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleChangeArray(activeTab, index, 'name', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    placeholder="e.g. Marvel"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link Path</label>
                                                <input
                                                    type="text"
                                                    value={item.path}
                                                    onChange={(e) => handleChangeArray(activeTab, index, 'path', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    placeholder="e.g. /shop?theme=Marvel"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Logo Image URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={item.image}
                                                        onChange={(e) => handleChangeArray(activeTab, index, 'image', e.target.value)}
                                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    />
                                                    <label className="flex items-center justify-center px-4 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition-colors whitespace-nowrap">
                                                        <span className="text-xs font-bold uppercase">{uploadingField === `franchises-${index}-image` ? 'UP...' : 'UPLOAD'}</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'franchises', index, 'image')} disabled={uploadingField !== null} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gradient Color Classes (Tailwind)</label>
                                                <input
                                                    type="text"
                                                    value={item.color}
                                                    onChange={(e) => handleChangeArray(activeTab, index, 'color', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    placeholder="e.g. from-red-900 to-red-600"
                                                />
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Background Image URL (Optional)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={item.bgImage}
                                                        onChange={(e) => handleChangeArray(activeTab, index, 'bgImage', e.target.value)}
                                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                    />
                                                    <label className="flex items-center justify-center px-4 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition-colors whitespace-nowrap">
                                                        <span className="text-xs font-bold uppercase">{uploadingField === `franchises-${index}-bgImage` ? 'UP...' : 'UPLOAD'}</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'franchises', index, 'bgImage')} disabled={uploadingField !== null} />
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeItem(activeTab, index)}
                                    className="absolute top-6 right-6 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <MdDelete size={24} />
                                </button>
                            </div>
                        ))}

                        {activeTab === 'seo' && (
                            <div className="space-y-8">
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md text-yellow-800 text-sm font-medium">
                                    <p>These settings inject dynamic meta tags (&lt;title&gt;, &lt;meta description&gt;, &lt;meta keywords&gt;) into the specific pages to improve overall SEO.</p>
                                </div>
                                {['home', 'about', 'contact', 'shop', 'faq', 'careers'].map(page => (
                                    <div key={page} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group space-y-4">
                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
                                            {page} Page SEO
                                        </h3>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Title</label>
                                            <input
                                                type="text"
                                                value={formData.seo[page]?.metaTitle || ''}
                                                onChange={(e) => handleSeoChange(page, 'metaTitle', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder={`e.g. ${page.charAt(0).toUpperCase() + page.slice(1)} - NazraKart`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Keywords</label>
                                            <input
                                                type="text"
                                                value={formData.seo[page]?.metaKeywords || ''}
                                                onChange={(e) => handleSeoChange(page, 'metaKeywords', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                                placeholder="e.g. merchandise, apparel, accessories"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Description</label>
                                            <textarea
                                                value={formData.seo[page]?.metaDescription || ''}
                                                onChange={(e) => handleSeoChange(page, 'metaDescription', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red focus:bg-white transition-colors min-h-[100px]"
                                                placeholder="Brief description of the page content for search engines..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab !== 'seo' && formData[activeTab].length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                                <p className="text-gray-500">No {activeTab} defined yet.</p>
                                <button
                                    onClick={() => addItem(activeTab)}
                                    className="mt-4 text-tss-red font-bold hover:underline"
                                >
                                    Add your first item
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeManagement;
