import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    MdSearch,
    MdEdit,
    MdDelete,
    MdClose,
    MdAdd,
    MdCategory
} from 'react-icons/md';

const CategoryManagement = () => {
    const { getToken } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, category = null) => {
        setModalMode(mode);
        setSelectedCategory(category);

        if (mode === 'edit' && category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                isActive: category.isActive !== undefined ? category.isActive : true
            });
        } else {
            setFormData({
                name: '',
                description: '',
                isActive: true
            });
        }

        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            return alert('Category name is required');
        }

        try {
            setSaving(true);
            const url = modalMode === 'edit'
                ? `${import.meta.env.VITE_API_URL}/api/categories/${selectedCategory._id}`
                : `${import.meta.env.VITE_API_URL}/api/categories`;

            const method = modalMode === 'edit' ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchCategories();
                handleCloseModal();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to save category');
            }
        } catch (error) {
            console.error('API Error:', error);
            alert('Failed to connect to the server');
        } finally {
            setSaving(false);
        }
    };

    const deleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? Products using this category might be affected.')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });

                if (res.ok) {
                    setCategories(categories.filter(c => c._id !== id));
                } else {
                    const data = await res.json();
                    alert(data.message || 'Failed to delete category');
                }
            } catch (error) {
                console.error('API Error:', error);
            }
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500 mt-1">Manage product categories and collections</p>
                </div>
                <button
                    onClick={() => handleOpenModal('add')}
                    className="flex items-center gap-2 px-6 py-3 bg-tss-red text-white rounded-md font-bold hover:bg-red-700 transition-colors shadow-sm"
                >
                    <MdAdd size={20} />
                    Add Category
                </button>
            </div>

            {/* Config & List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Search Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red focus:ring-1 focus:ring-tss-red transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading categories...</td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <MdCategory size={24} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-900 font-medium mb-1">No categories found</p>
                                            <p className="text-sm">Try modifying your search or add a new category.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 border-l-4 border-transparent hover:border-l-tss-red transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-red-50 flex items-center justify-center text-tss-red flex-shrink-0">
                                                    <MdCategory size={20} />
                                                </div>
                                                <p className="font-bold text-gray-900">{category.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500 max-w-xs truncate">{category.description || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal('edit', category)}
                                                    className="p-2 text-gray-400 hover:text-tss-red hover:bg-red-50 rounded-md transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <MdEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteCategory(category._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete Category"
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative w-full max-w-md bg-white rounded-xl flex flex-col shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                                {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSaveCategory} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-tss-red focus:bg-white transition-colors"
                                    placeholder="e.g. Action Figures"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-tss-red focus:bg-white transition-colors resize-none"
                                    placeholder="Brief description of the category..."
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tss-red"></div>
                                </label>
                                <span className="text-sm font-medium text-gray-700">Active (Visible in store)</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-2.5 px-4 bg-tss-red text-white rounded-md font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex flex-col items-center justify-center"
                                >
                                    {saving ? 'Saving...' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
