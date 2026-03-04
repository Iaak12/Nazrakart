import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdSave, MdAdd, MdDelete } from 'react-icons/md';

const AboutManagement = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        heroTitle: '',
        heroDescription: '',
        storyTitle: '',
        storyParagraph1: '',
        storyParagraph2: '',
        features: []
    });

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/about`);
            const data = await res.json();

            if (res.ok) {
                setFormData({
                    heroTitle: data.heroTitle || '',
                    heroDescription: data.heroDescription || '',
                    storyTitle: data.storyTitle || '',
                    storyParagraph1: data.storyParagraph1 || '',
                    storyParagraph2: data.storyParagraph2 || '',
                    features: data.features || []
                });
            }
        } catch (error) {
            console.error('Failed to fetch About Data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [
                ...prev.features,
                { iconName: 'MdStar', title: 'New Feature', description: 'Feature description' }
            ]
        }));
    };

    const removeFeature = (index) => {
        const newFeatures = [...formData.features];
        newFeatures.splice(index, 1);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/about`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('About Us page updated successfully!');
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

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading About Us data...</div>;
    }

    return (
        <div className="p-6 lg:p-8 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">About Us Management</h1>
                    <p className="text-gray-500 mt-1">Manage the content displayed on the About Us page</p>
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
                {/* Hero Section Info */}
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

                {/* Story Section Info */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">Our Story Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Story Title</label>
                            <input
                                type="text"
                                name="storyTitle"
                                value={formData.storyTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-tss-red transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Story Paragraph 1</label>
                            <textarea
                                name="storyParagraph1"
                                value={formData.storyParagraph1}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-tss-red transition-colors resize-y"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Story Paragraph 2</label>
                            <textarea
                                name="storyParagraph2"
                                value={formData.storyParagraph2}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-tss-red transition-colors resize-y"
                            />
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Features</h2>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="flex items-center gap-1 text-sm font-bold text-tss-red hover:text-red-700"
                        >
                            <MdAdd size={16} /> Add Feature
                        </button>
                    </div>

                    <div className="space-y-6">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative pr-12">
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <MdDelete size={20} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={feature.title}
                                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Icon Name (Material Design)</label>
                                        <input
                                            type="text"
                                            value={feature.iconName}
                                            onChange={(e) => handleFeatureChange(index, 'iconName', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red"
                                            placeholder="e.g. MdHighQuality"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                                    <textarea
                                        value={feature.description}
                                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red resize-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AboutManagement;
