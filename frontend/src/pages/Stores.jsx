import React, { useState, useEffect } from 'react';
import { MdLocationOn, MdPhone, MdAccessTime } from 'react-icons/md';

const Stores = () => {
    const [data, setData] = useState({
        heroTitle: 'Our Stores',
        heroDescription: 'Experience our products in person. Find a NazraKart store near you and explore our latest collections.',
        locations: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stores`);
                const json = await res.json();
                if (res.ok) {
                    setData(json);
                }
            } catch (error) {
                console.error("Error fetching stores data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-wider">{data.heroTitle}</h1>
                    <p className="text-lg text-gray-600">{data.heroDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {data.locations.map((store, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col sm:flex-row group hover:shadow-lg transition-all duration-300">
                            <div className="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                                <img
                                    src={store.image}
                                    alt={`${store.branch} store`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm">
                                    <span className="text-xs font-black text-tss-red uppercase tracking-widest">{store.city}</span>
                                </div>
                            </div>
                            <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{store.branch}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 text-gray-600">
                                            <MdLocationOn className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                                            <p className="text-sm font-medium">{store.address}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <MdPhone className="text-gray-400 flex-shrink-0" size={20} />
                                            <p className="text-sm font-medium">{store.phone}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <MdAccessTime className="text-gray-400 flex-shrink-0" size={20} />
                                            <p className="text-sm font-medium">{store.hours}</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-6 w-full py-2.5 bg-gray-50 hover:bg-tss-red text-gray-900 hover:text-white border border-gray-200 hover:border-tss-red rounded-md font-bold uppercase tracking-widest transition-colors text-sm text-center">
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stores;
