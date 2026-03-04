import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdSearch,
    MdFilterList,
    MdClose,
    MdCloudUpload
} from 'react-icons/md';

const ProductManagement = () => {
    const { getToken } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchThemes();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=100`);
            const data = await res.json();
            if (res.ok && data.products) {
                const mappedProducts = data.products.map(p => ({
                    ...p,
                    id: p._id,
                    category: p.category ? p.category.name : 'Uncategorized',
                    categoryId: p.category ? p.category._id : null,
                    image: p.images && p.images.length > 0 ? p.images[0] : '',
                    status: p.stock > 20 ? 'Active' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
            const data = await res.json();
            if (res.ok) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchThemes = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/themes`);
            const data = await res.json();
            if (res.ok) {
                setThemes(data);
            }
        } catch (error) {
            console.error('Error fetching themes:', error);
        }
    };

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '30', '32', '34', '36'];

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        memberPrice: '',
        stock: '',
        description: '',
        gender: '',
        theme: '',
        sizes: [],
        image: '',
        hoverImage: '',
    });

    const [uploadingImage, setUploadingImage] = useState(false);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.categoryId || '',
                price: product.price,
                memberPrice: product.memberPrice || '',
                stock: product.stock,
                description: product.description || '',
                gender: product.gender || '',
                theme: product.theme || '',
                sizes: product.sizes || [],
                image: product.image || '',
                hoverImage: product.hoverImage || '',
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', category: '', price: '', memberPrice: '', stock: '', description: '', gender: '', theme: '', sizes: [], image: '', hoverImage: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({ name: '', category: '', price: '', memberPrice: '', stock: '', description: '', gender: '', theme: '', sizes: [], image: '', hoverImage: '' });
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploadingImage(true);
        try {
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

            setFormData(prev => ({
                ...prev,
                [field]: data.imageUrl
            }));
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = getToken();
        // Use the uploaded image if available, else a placeholder
        const productImageUrl = formData.image || `https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1687842433_3385319.jpg?format=webp&w=480&dpr=1.0`;

        const payload = {
            ...formData,
            category: formData.category, // Submit the object ID
            price: Number(formData.price),
            memberPrice: Number(formData.memberPrice) || 0,
            stock: Number(formData.stock),
            images: [productImageUrl] // Store it in the images array for the backend
        };

        try {
            let res;
            if (editingProduct) {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                fetchProducts();
                handleCloseModal();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = getToken();
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    fetchProducts();
                } else {
                    const data = await res.json();
                    alert(data.message || 'Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Low Stock': return 'bg-yellow-100 text-yellow-700';
            case 'Out of Stock': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your product inventory</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-tss-red text-white rounded-md font-bold uppercase tracking-widest shadow-md hover:opacity-90 transition-all duration-300"
                >
                    <MdAdd size={20} />
                    Add Product
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 transition-all font-bold">
                    <MdFilterList size={20} />
                    Filters
                </button>
            </div>

            {/* Products Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-gray-500 border-b border-gray-200 bg-gray-50 uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4 hidden md:table-cell">Category</th>
                                <th className="px-6 py-4 hidden lg:table-cell">Gender</th>
                                <th className="px-6 py-4 text-center">Price (₹)</th>
                                <th className="px-6 py-4 hidden sm:table-cell text-center">Stock</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-md object-cover border border-gray-100"
                                            />
                                            <span className="font-bold text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell text-sm">
                                        {product.category}
                                        {product.theme && <span className="block text-xs text-gray-400 mt-0.5">{product.theme}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 hidden lg:table-cell text-sm">{product.gender}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="font-bold text-gray-900">₹{product.price}</div>
                                        {product.memberPrice && <div className="text-xs text-tss-red font-bold">₹{product.memberPrice} (TSS)</div>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell text-center font-medium">{product.stock}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="p-2 text-gray-400 hover:text-tss-red hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <MdDelete size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 font-medium">Showing {filteredProducts.length} of {products.length} products</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md transition-colors hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="px-4 py-2 text-sm font-bold bg-tss-red text-white border border-tss-red rounded-md">1</button>
                        <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md transition-colors hover:bg-gray-50">2</button>
                        <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md transition-colors hover:bg-gray-50">3</button>
                        <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md transition-colors hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between z-10">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="flex justify-center gap-4">
                                <label className="flex-1 max-w-[200px] h-32 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-tss-red hover:bg-red-50 transition-colors relative overflow-hidden">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Main" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                    ) : null}
                                    <MdCloudUpload size={32} className="text-gray-400 z-10" />
                                    <span className="text-xs text-gray-700 font-bold uppercase z-10">{uploadingImage ? 'Uploading...' : 'Main Image'}</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} disabled={uploadingImage} />
                                </label>
                                <label className="flex-1 max-w-[200px] h-32 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-tss-red hover:bg-red-50 transition-colors relative overflow-hidden">
                                    {formData.hoverImage ? (
                                        <img src={formData.hoverImage} alt="Hover" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                    ) : null}
                                    <MdCloudUpload size={32} className="text-gray-400 z-10" />
                                    <span className="text-xs text-gray-700 font-bold uppercase z-10">{uploadingImage ? 'Uploading...' : 'Hover Image'}</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hoverImage')} disabled={uploadingImage} />
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Unisex">Unisex</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Theme / Franchise</label>
                                <select
                                    value={formData.theme}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all"
                                >
                                    <option value="">Select Theme (Optional)</option>
                                    {themes.map(t => (
                                        <option key={t._id} value={t.name}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Regular Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red transition-all"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Member Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.memberPrice}
                                        onChange={(e) => setFormData({ ...formData, memberPrice: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red transition-all"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red transition-all"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => handleSizeToggle(size)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-sm border text-sm font-bold transition-all ${formData.sizes.includes(size)
                                                ? 'bg-tss-red border-tss-red text-white'
                                                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red transition-all resize-none"
                                    placeholder="Enter product description"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-3 px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-bold uppercase tracking-widest transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadingImage}
                                    className="flex-1 py-3 px-4 bg-tss-red text-white rounded-md font-bold uppercase tracking-widest shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
