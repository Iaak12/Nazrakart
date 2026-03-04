import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MdSearch, MdFilterList, MdGridView, MdViewList, MdClose, MdShoppingCart } from 'react-icons/md';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/Products/ProductCard';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const { formatPrice } = useCurrency();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [gender, setGender] = useState(searchParams.get('gender') || '');
    const [theme, setTheme] = useState(searchParams.get('theme') || '');
    const [size, setSize] = useState(searchParams.get('size') || '');
    const [sort, setSort] = useState('newest');

    const categories = ['T-Shirts', 'Shirts', 'Joggers', 'Jeans', 'Shoes', 'Accessories'];
    const themes = ['Marvel', 'DC', 'Harry Potter', 'Star Wars', 'Originals', 'Disney'];
    const genders = ['Men', 'Women', 'Unisex', 'Kids'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Fetch real products from backend
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                const data = await res.json();

                let filtered = res.ok && Array.isArray(data.products) ? data.products : [];

                // Fallback to empty array if no real products, or keep a few mock products but with valid ObjectIds? 
                // Let's rely on the real DB products, assuming the user created some.

                if (search) {
                    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
                }
                if (category) {
                    filtered = filtered.filter(p => p.category?.name?.toLowerCase() === category.toLowerCase() || p.category?.toLowerCase() === category.toLowerCase());
                }
                if (gender) {
                    filtered = filtered.filter(p => p.gender?.toLowerCase() === gender.toLowerCase());
                }
                if (theme) {
                    filtered = filtered.filter(p => p.theme?.toLowerCase() === theme.toLowerCase());
                }
                if (size) {
                    filtered = filtered.filter(p => p.sizes?.includes(size));
                }

                switch (sort) {
                    case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
                    case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
                    case 'rating': filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
                    default: break;
                }

                setProducts(filtered);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search, category, gender, theme, size, sort]);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setGender('');
        setTheme('');
        setSize('');
        setSort('newest');
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-gray-50 border-t border-gray-100">
            {/* Header */}
            <section className="bg-white py-8 border-b border-gray-100 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-widest uppercase mb-2">Shop</h1>
                    <p className="text-gray-500 font-medium">Official Merchandise</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                    <p className="text-gray-500">{products.length} products found</p>
                    <div className="flex items-center gap-3">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-gray-400"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600"
                        >
                            <MdFilterList size={20} />
                        </button>
                        <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                            >
                                <MdGridView size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                            >
                                <MdViewList size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`
            fixed lg:static inset-0 z-50 lg:z-0 
            lg:w-64 flex-shrink-0
            ${showFilters ? 'block' : 'hidden lg:block'}
          `}>
                        <div className="lg:hidden fixed inset-0 bg-black/50" onClick={() => setShowFilters(false)}></div>
                        <div className="fixed lg:static top-0 left-0 h-full lg:h-auto w-80 lg:w-full bg-white p-6 lg:p-0 overflow-y-auto z-10 shadow-xl lg:shadow-none">
                            <div className="flex items-center justify-between mb-6 lg:hidden">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="text-gray-400"><MdClose size={24} /></button>
                            </div>

                            <div className="space-y-8">
                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b pb-2">Gender</label>
                                    <div className="space-y-2">
                                        {genders.map((gen) => (
                                            <button
                                                key={gen}
                                                onClick={() => setGender(gender === gen.toLowerCase() ? '' : gen.toLowerCase())}
                                                className={`w-full text-left px-3 py-1.5 rounded-sm text-sm transition-all font-medium border border-transparent ${gender === gen.toLowerCase()
                                                    ? 'bg-tss-red text-white'
                                                    : 'text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {gen}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Themes */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b pb-2">Themes</label>
                                    <div className="space-y-2">
                                        {themes.map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTheme(theme === t.toLowerCase() ? '' : t.toLowerCase())}
                                                className={`w-full text-left px-3 py-1.5 rounded-sm text-sm transition-all font-medium border border-transparent ${theme === t.toLowerCase()
                                                    ? 'bg-tss-red text-white'
                                                    : 'text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b pb-2">Categories</label>
                                    <div className="space-y-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(category === cat.toLowerCase() ? '' : cat.toLowerCase())}
                                                className={`w-full text-left px-3 py-1.5 rounded-sm text-sm transition-all font-medium border border-transparent ${category === cat.toLowerCase()
                                                    ? 'bg-gray-900 text-white'
                                                    : 'text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b pb-2">Sizes</label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSize(size === s ? '' : s)}
                                                className={`w-10 h-10 flex flex-shrink-0 items-center justify-center font-bold text-xs rounded-sm border transition-colors ${size === s
                                                    ? 'bg-tss-red text-white border-tss-red'
                                                    : 'bg-white text-gray-600 border-gray-300 hover:border-tss-red hover:text-tss-red'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="w-full py-2.5 text-sm text-white font-bold tracking-widest uppercase bg-gray-900 rounded-sm hover:bg-gray-800 transition-all"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-square bg-gray-100 rounded-3xl mb-4"></div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                            <div className="h-5 bg-gray-100 rounded w-1/3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg mb-4">No products found</p>
                                <button onClick={clearFilters} className="text-gray-900 hover:underline font-medium">
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
                                : 'space-y-6'
                            }>
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
