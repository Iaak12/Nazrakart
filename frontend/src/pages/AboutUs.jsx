import React, { useState, useEffect } from 'react';
import { MdSpeed, MdSecurity, MdLocalShipping, MdSupportAgent, MdStar, MdCheckCircle } from 'react-icons/md';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';

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
            case 'MdSpeed': return <MdSpeed className={className} />;
            case 'MdSecurity': return <MdSecurity className={className} />;
            case 'MdLocalShipping': return <MdLocalShipping className={className} />;
            case 'MdSupportAgent': return <MdSupportAgent className={className} />;
            default: return <MdStar className={className} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-tss-gray-200 border-t-tss-red rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!aboutData) return <div className="text-center py-20 text-tss-gray-500 font-bold uppercase tracking-widest">No content available</div>;

    return (
        <div className="bg-white min-h-screen pb-24">
            <SEO pageName="about" />

            {/* Hero Section */}
            <div className="bg-tss-gray-100 py-20 md:py-32 border-b border-tss-gray-200">
                <div className="tss-container text-center max-w-4xl mx-auto">
                    <span className="text-tss-red font-black text-[12px] uppercase tracking-[0.3em] mb-6 block">Our Story</span>
                    <h1 className="text-4xl md:text-6xl font-black text-tss-black uppercase tracking-tight mb-8 leading-[1.1]">
                        {aboutData.heroTitle}
                    </h1>
                    <p className="text-[14px] md:text-[16px] text-tss-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                        {aboutData.heroDescription}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="tss-container py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                        <div className="aspect-[4/5] bg-tss-gray-50 rounded-sm overflow-hidden border border-tss-gray-200 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                            <img
                                src="https://images.unsplash.com/photo-1556740734-7f9518600a94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Our Story"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-tss-red -z-10 rounded-sm"></div>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-black text-tss-black uppercase tracking-tight">
                                {aboutData.storyTitle}
                            </h2>
                            <div className="w-20 h-2 bg-tss-red"></div>
                        </div>

                        <div className="space-y-6 text-tss-gray-500 font-medium leading-loose text-[15px]">
                            <p>{aboutData.storyParagraph1}</p>
                            <p>{aboutData.storyParagraph2}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8">
                            <div className="border-l-4 border-tss-green pl-6">
                                <p className="text-3xl font-black text-tss-black">10M+</p>
                                <p className="text-[10px] font-black text-tss-gray-400 uppercase tracking-widest mt-1">Happy Customers</p>
                            </div>
                            <div className="border-l-4 border-[#117a7a] pl-6">
                                <p className="text-3xl font-black text-tss-black">500+</p>
                                <p className="text-[10px] font-black text-tss-gray-400 uppercase tracking-widest mt-1">Designers Hub</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-tss-gray-50 py-24 border-y border-tss-gray-200">
                <div className="tss-container">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-tss-black uppercase tracking-widest mb-4">The Triple Benefit</h2>
                        <p className="text-[12px] font-black text-tss-gray-400 uppercase tracking-widest">Why shoppers around the world choose us</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {aboutData.features.map((feature, index) => (
                            <div key={index} className="bg-white p-10 rounded-sm border border-tss-gray-200 transition-all hover:shadow-2xl hover:border-tss-red group">
                                <div className="w-16 h-16 bg-tss-gray-50 rounded-sm flex items-center justify-center mb-8 group-hover:bg-tss-red group-hover:text-white transition-colors">
                                    {getIcon(feature.iconName, "w-8 h-8 text-current")}
                                </div>
                                <h3 className="text-[14px] font-black text-tss-black uppercase tracking-widest mb-4">{feature.title}</h3>
                                <p className="text-[12px] font-bold text-tss-gray-400 uppercase tracking-wider leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter Call to Action */}
            <div className="tss-container py-24">
                <div className="bg-tss-black text-white p-12 md:p-20 rounded-sm text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-6">Join the Revolution</h2>
                        <p className="text-[14px] font-bold uppercase tracking-widest opacity-60 mb-10 leading-relaxed">
                            Be the first to know about our latest collaborations, secret sales, and pop-up events.
                        </p>
                        <form className="flex flex-col md:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL ADDRESS"
                                className="flex-1 bg-white/10 border border-white/20 px-8 py-5 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-white transition-colors"
                            />
                            <button className="bg-tss-red px-12 py-5 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-700 transition-all">
                                SUBSCRIBE
                            </button>
                        </form>
                    </div>
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <MdCheckCircle size={300} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
