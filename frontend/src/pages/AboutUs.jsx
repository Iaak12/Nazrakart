import React, { useState, useEffect } from 'react';
import { MdHighQuality, MdStorefront, MdPeople, MdLocalShipping, MdSupportAgent, MdStar, MdCheckCircle } from 'react-icons/md';
import SEO from '../components/SEO';
import DynamicHeading from '../components/DynamicHeading';

const AboutUs = () => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/about`);
                const data = await res.json();
                if (res.ok) {
                    setAboutData(data);
                }
            } catch (error) {
                console.error('Failed to fetch About Us data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutData();
    }, []);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'MdHighQuality': return <MdHighQuality size={32} />;
            case 'MdStorefront': return <MdStorefront size={32} />;
            case 'MdPeople': return <MdPeople size={32} />;
            case 'MdLocalShipping': return <MdLocalShipping size={32} />;
            default: return <MdHighQuality size={32} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-tss-gray-200 border-t-tss-red rounded-full animate-spin"></div>
            </div>
        );
    }

    // Use default data if fetch fails or is empty
    const data = aboutData || {
        heroTitle: "About NazraKart",
        heroTitleTag: "h1",
        heroDescription: "We are your ultimate destination for premium pop-culture merchandise. Our mission is to bring your favorite characters, movies, and TV shows to life through high-quality apparel and accessories.",
        storyTitle: "Our Story",
        storyTitleTag: "h2",
        storyParagraph1: "Founded with a passion for pop culture and a commitment to quality, NazraKart started as a small idea that grew into a massive community. We noticed a gap in the market for merchandise that was both stylish and comfortable, so we decided to create our own.",
        storyParagraph2: "Today, we partner with top franchises and independent artists to bring you an ever-expanding catalog of exclusive designs. Whether you are a superhero fanatic, an anime lover, or a gaming enthusiast, we have something special just for you.",
        features: [
            { iconName: 'MdHighQuality', title: 'Premium Quality', titleTag: 'h3', description: 'We use only the best materials to ensure our products are comfortable, durable, and look amazing.' },
            { iconName: 'MdStorefront', title: 'Exclusive Designs', titleTag: 'h3', description: 'Our in-house design team creates unique, eye-catching apparel you will not find anywhere else.' },
            { iconName: 'MdPeople', title: 'Community First', titleTag: 'h3', description: 'We are more than just a brand; we are a community of passionate fans and pop-culture enthusiasts.' },
            { iconName: 'MdLocalShipping', title: 'Fast Delivery', titleTag: 'h3', description: 'We work hard to get your favorite merchandise delivered to your doorstep as quickly as possible.' }
        ]
    };

    return (
        <div className="bg-white min-h-screen pb-24">
            <SEO pageName="about" />

            {/* Hero Section */}
            <div className="bg-tss-black text-white py-24 md:py-40 relative overflow-hidden">
                <div className="tss-container relative z-10 text-center max-w-4xl mx-auto">
                    <DynamicHeading
                        tag={data.heroTitleTag}
                        className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic mb-8"
                    >
                        {data.heroTitle.split(' ').map((word, i) => (
                            <span key={i} className={i === data.heroTitle.split(' ').length - 1 ? "text-tss-red" : ""}>
                                {word}{' '}
                            </span>
                        ))}
                    </DynamicHeading>
                    <div
                        className="text-sm md:text-lg font-bold opacity-60 leading-relaxed max-w-2xl mx-auto rich-text-content"
                        dangerouslySetInnerHTML={{ __html: data.heroDescription }}
                    />
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            {/* Story Section */}
            <section className="py-24 md:py-32 tss-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <DynamicHeading
                            tag={data.storyTitleTag}
                            className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8"
                        >
                            {data.storyTitle.split(' ').map((word, i) => (
                                <span key={i} className={i === 0 ? "text-tss-red" : ""}>
                                    {word}{' '}
                                </span>
                            ))}
                        </DynamicHeading>
                        <div className="space-y-6 text-tss-gray-500 font-bold text-[14px] leading-loose rich-text-content">
                            <div dangerouslySetInnerHTML={{ __html: data.storyParagraph1 }} />
                            <div dangerouslySetInnerHTML={{ __html: data.storyParagraph2 }} />
                        </div>
                    </div>
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
                </div>
            </section>

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
                                <div
                                    className="text-[13px] font-bold text-tss-gray-400 leading-relaxed rich-text-content"
                                    dangerouslySetInnerHTML={{ __html: feature.description }}
                                />
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
