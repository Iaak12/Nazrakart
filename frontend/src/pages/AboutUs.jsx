import React, { useState, useEffect } from 'react';
import { MdStorefront, MdPeople, MdLocalShipping, MdHighQuality, MdStar } from 'react-icons/md';

const AboutUs = () => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/about`);
                const data = await res.json();
                if (res.ok) {
                    setAboutData(data);
                }
            } catch (error) {
                console.error('Error fetching about data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    const getIcon = (iconName, className) => {
        switch (iconName) {
            case 'MdHighQuality': return <MdHighQuality className={className} />;
            case 'MdStorefront': return <MdStorefront className={className} />;
            case 'MdPeople': return <MdPeople className={className} />;
            case 'MdLocalShipping': return <MdLocalShipping className={className} />;
            default: return <MdStar className={className} />;
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Loading About Us...</div>;
    if (!aboutData) return <div className="text-center py-20 text-gray-500">No content available</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-6">
                            {aboutData.heroTitle}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                            {aboutData.heroDescription}
                        </p>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">{aboutData.storyTitle}</h2>
                        <div className="w-16 h-1 bg-tss-red rounded"></div>
                        <p className="text-gray-600 leading-relaxed">
                            {aboutData.storyParagraph1}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            {aboutData.storyParagraph2}
                        </p>
                    </div>
                    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 font-medium">About Us Image</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Why Choose Us</h2>
                        <div className="w-16 h-1 bg-tss-red rounded mx-auto mt-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {aboutData.features.map((feature, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-md transition-shadow duration-300">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    {getIcon(feature.iconName, "w-8 h-8 text-tss-red")}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
