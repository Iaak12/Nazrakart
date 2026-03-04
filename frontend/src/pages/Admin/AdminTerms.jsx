import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdSave } from 'react-icons/md';

const AdminTerms = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        content: '',
        lastUpdated: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/terms`);
            const data = await res.json();
            if (res.ok) {
                setFormData({
                    content: data.content || '',
                    lastUpdated: data.lastUpdated || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch Terms Data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/terms`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Terms & Conditions updated successfully!');
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Terms data...</div>;

    return (
        <div className="p-6 lg:p-8 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
                    <p className="text-gray-500 mt-1">Manage the Terms & Conditions page content</p>
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
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Last Updated Date</label>
                            <input
                                type="text"
                                name="lastUpdated"
                                value={formData.lastUpdated}
                                onChange={handleChange}
                                placeholder="e.g., March 4, 2026"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-tss-red transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Page Content (Supports HTML formatting)</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="20"
                                className="w-full px-4 py-2 font-mono text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-tss-red transition-colors resize-y"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                You can use standard HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, and &lt;strong&gt; to format the content.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminTerms;
