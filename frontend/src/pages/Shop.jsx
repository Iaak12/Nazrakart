import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MdSearch, MdFilterList, MdGridView, MdViewList, MdClose, MdRefresh } from 'react-icons/md';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/Products/ProductCard';
import SEO from '../components/SEO';

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
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                const data = await res.json();
                let filtered = res.ok && Array.isArray(data.products) ? data.products : [];

                if (search) {
                    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
                }
                if (category) {
                    filtered = filtered.filter(p =>
                        p.category?.name?.toLowerCase() === category.toLowerCase() ||
                        p.category?.toLowerCase() === category.toLowerCase()
                    );
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

    const clearFilters = () => {
        setSearch(''); setCategory(''); setGender(''); setTheme(''); setSize(''); setSort('newest');
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-white">
            <SEO pageName="shop" />

            {/* Breadcrumb / Title area */}
            <section className="bg-tss-gray-100 py-6 border-b border-tss-gray-200">
                <div className="tss-container">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-tss-black tracking-widest uppercase">
                                {category || theme || gender || 'All Products'}
                            </h1>
                            <p className="text-[10px] text-tss-gray-500 font-bold tracking-widest uppercase mt-1">
                                {products.length} Items Found
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-tss-gray-400 uppercase tracking-widest">Sort By:</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="bg-white border border-tss-gray-200 rounded-sm px-4 py-2 text-[11px] font-black uppercase tracking-widest text-tss-black focus:outline-none focus:border-tss-red cursor-pointer"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Popularity</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <div className="tss-container py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="lg:hidden flex items-center justify-center gap-2 w-full py-4 bg-tss-black text-white font-black text-xs tracking-widest uppercase rounded-sm"
                    >
                        <MdFilterList size={20} />
                        Filters
                    </button>

                    {/* Filters Sidebar */}
                    <aside className={`
                        fixed lg:static inset-0 z-50 lg:z-0 
                        lg:w-72 flex-shrink-0 transition-all duration-300
                        ${showFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto hidden lg:block'}
                    `}>
                        <div className="lg:hidden absolute inset-0 bg-tss-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
                        <div className="relative h-full lg:h-auto w-[85%] lg:w-full bg-white lg:bg-transparent overflow-y-auto z-10 p-8 lg:p-0">
                            <div className="flex items-center justify-between mb-8 lg:hidden">
                                <h3 className="text-xl font-black text-tss-black tracking-widest uppercase">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="text-tss-gray-500 hover:text-tss-red"><MdClose size={28} /></button>
                            </div>

                            <div className="space-y-10">
                                {/* Filter Section Template */}
                                {[
                                    { label: 'Gender', items: genders, active: gender, setter: setGender },
                                    { label: 'Themes', items: themes, active: theme, setter: setTheme },
                                    { label: 'Categories', items: categories, active: category, setter: setCategory }
                                ].map((section) => (
                                    <div key={section.label}>
                                        <h4 className="text-[12px] font-black text-tss-black uppercase tracking-widest border-b-2 border-tss-black w-max pb-1 mb-4">
                                            {section.label}
                                        </h4>
                                        <div className="flex flex-col gap-2">
                                            {section.items.map((item) => (
                                                <button
                                                    key={item}
                                                    onClick={() => section.setter(section.active === item.toLowerCase() ? '' : item.toLowerCase())}
                                                    className={`text-left text-[11px] font-bold uppercase tracking-widest py-1 transition-colors
                                                        ${section.active === item.toLowerCase() ? 'text-tss-red' : 'text-tss-gray-500 hover:text-tss-black'}`}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Sizes Grid */}
                                <div>
                                    <h4 className="text-[12px] font-black text-tss-black uppercase tracking-widest border-b-2 border-tss-black w-max pb-1 mb-4">
                                        Sizes
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {sizes.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSize(size === s ? '' : s)}
                                                className={`h-10 flex items-center justify-center text-[10px] font-black rounded-sm border transition-all
                                                    ${size === s
                                                        ? 'bg-tss-black text-white border-tss-black'
                                                        : 'bg-white text-tss-gray-500 border-tss-gray-200 hover:border-tss-black hover:text-tss-black'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="w-full flex items-center justify-center gap-2 py-3 text-[10px] text-tss-gray-500 font-black tracking-widest uppercase bg-tss-gray-100 rounded-sm hover:bg-tss-gray-200 transition-all border border-tss-gray-200"
                                >
                                    <MdRefresh size={16} />
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[4/5] bg-tss-gray-100 rounded-sm mb-4"></div>
                                        <div className="space-y-3">
                                            <div className="h-2.5 bg-tss-gray-100 rounded w-3/4"></div>
                                            <div className="h-2 bg-tss-gray-100 rounded w-1/2"></div>
                                            <div className="h-3 bg-tss-gray-100 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 bg-tss-gray-50 rounded-lg">
                                <div className="max-w-xs mx-auto">
                                    <MdSearch size={64} className="mx-auto text-tss-gray-200 mb-6" />
                                    <h3 className="text-lg font-black text-tss-black tracking-widest uppercase mb-2">No results found</h3>
                                    <p className="text-xs text-tss-gray-500 font-bold uppercase tracking-wider mb-8">Try adjusting your filters or search query</p>
                                    <button onClick={clearFilters} className="tss-button-primary w-full">CLEAR ALL FILTERS</button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
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
