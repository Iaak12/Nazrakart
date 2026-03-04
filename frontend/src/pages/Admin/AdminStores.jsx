import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdSave, MdAdd, MdDelete, MdImage } from 'react-icons/md';

const AdminStores = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        heroTitle: '',
        heroDescription: '',
        locations: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stores`);
            const data = await res.json();
            if (res.ok) {
                setFormData({
                    heroTitle: data.heroTitle || '',
                    heroDescription: data.heroDescription || '',
                    locations: data.locations || []
                });
            }
        } catch (error) {
            console.error('Failed to fetch Stores Data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (index, field, value) => {
        const newLocations = [...formData.locations];
        newLocations[index] = { ...newLocations[index], [field]: value };
        setFormData(prev => ({ ...prev, locations: newLocations }));
    };

    const addLocation = () => {
        setFormData(prev => ({
            ...prev,
            locations: [
                ...prev.locations,
                { city: 'New City', branch: 'New Branch', address: 'Pending', phone: '0000000', hours: 'TBD', image: 'https://via.placeholder.com/800' }
            ]
        }));
    };

    const removeLocation = (index) => {
        const newLocations = [...formData.locations];
        newLocations.splice(index, 1);
        setFormData(prev => ({ ...prev, locations: newLocations }));
    };

    const handleImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                body: uploadData
            });
            const data = await res.json();
            if (data.imageUrl) {
                handleLocationChange(index, 'image', data.imageUrl);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stores`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Stores page updated successfully!');
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Stores data...</div>;

    return (
        <div className="p-6 lg:p-8 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stores Management</h1>
                    <p className="text-gray-500 mt-1">Manage physical store locations dynamically</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-tss-red text-white rounded-md font-bold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    <MdSave size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <form className="space-y-8 max-w-4xl" onSubmit={handleSubmit}>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">Hero Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Hero Title</label>
                            <input
                                type="text"
                                name="heroTitle"
                                value={formData.heroTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-tss-red transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Hero Description</label>
                            <textarea
                                name="heroDescription"
                                value={formData.heroDescription}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-tss-red transition-colors resize-y"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Store Locations</h2>
                        <button type="button" onClick={addLocation} className="flex items-center gap-1 text-sm font-bold text-tss-red hover:text-red-700">
                            <MdAdd size={16} /> Add Location
                        </button>
                    </div>

                    <div className="space-y-6">
                        {formData.locations.map((loc, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative pr-12">
                                <button type="button" onClick={() => removeLocation(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                                    <MdDelete size={20} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">City</label>
                                        <input type="text" value={loc.city} onChange={(e) => handleLocationChange(index, 'city', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Branch Name</label>
                                        <input type="text" value={loc.branch} onChange={(e) => handleLocationChange(index, 'branch', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label>
                                        <input type="text" value={loc.address} onChange={(e) => handleLocationChange(index, 'address', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                                        <input type="text" value={loc.phone} onChange={(e) => handleLocationChange(index, 'phone', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hours</label>
                                        <input type="text" value={loc.hours} onChange={(e) => handleLocationChange(index, 'hours', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Store Image URL</label>
                                        <div className="flex gap-2">
                                            <input type="text" value={loc.image} onChange={(e) => handleLocationChange(index, 'image', e.target.value)} className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
                                            <label className="cursor-pointer bg-gray-100 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-200 text-gray-600 flex items-center justify-center">
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
                                                <MdImage size={20} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminStores;
