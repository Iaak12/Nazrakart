import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdSave, MdAdd, MdDelete } from 'react-icons/md';

const AdminCareers = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        heroTitle: '',
        heroDescription: '',
        jobs: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/careers`);
            const data = await res.json();
            if (res.ok) {
                setFormData({
                    heroTitle: data.heroTitle || '',
                    heroDescription: data.heroDescription || '',
                    jobs: data.jobs || []
                });
            }
        } catch (error) {
            console.error('Failed to fetch Careers Data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleJobChange = (index, field, value) => {
        const newJobs = [...formData.jobs];
        newJobs[index] = { ...newJobs[index], [field]: value };
        setFormData(prev => ({ ...prev, jobs: newJobs }));
    };

    const addJob = () => {
        setFormData(prev => ({
            ...prev,
            jobs: [
                ...prev.jobs,
                { title: 'New Role', department: 'Unspecified', location: 'Remote', type: 'Full-time' }
            ]
        }));
    };

    const removeJob = (index) => {
        const newJobs = [...formData.jobs];
        newJobs.splice(index, 1);
        setFormData(prev => ({ ...prev, jobs: newJobs }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/careers`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Careers page updated successfully!');
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Careers data...</div>;

    return (
        <div className="p-6 lg:p-8 bg-white min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Careers Management</h1>
                    <p className="text-gray-500 mt-1">Manage the content and job listings on the Careers page</p>
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
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Job Listings</h2>
                        <button type="button" onClick={addJob} className="flex items-center gap-1 text-sm font-bold text-tss-red hover:text-red-700">
                            <MdAdd size={16} /> Add Job
                        </button>
                    </div>

                    <div className="space-y-6">
                        {formData.jobs.map((job, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative pr-12">
                                <button type="button" onClick={() => removeJob(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                                    <MdDelete size={20} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                        <input type="text" value={job.title} onChange={(e) => handleJobChange(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Department</label>
                                        <input type="text" value={job.department} onChange={(e) => handleJobChange(index, 'department', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                                        <input type="text" value={job.location} onChange={(e) => handleJobChange(index, 'location', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                                        <input type="text" value={job.type} onChange={(e) => handleJobChange(index, 'type', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-tss-red" />
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

export default AdminCareers;
