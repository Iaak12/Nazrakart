import React, { useState, useEffect } from 'react';
import { MdWork, MdArrowForward, MdRocketLaunch, MdGroups, MdLightbulb, MdTrendingUp } from 'react-icons/md';
import SEO from '../components/SEO';

const Careers = () => {
    const [data, setData] = useState({
        heroTitle: 'Join Our Team',
        heroDescription: 'At NazraKart, we are always looking for passionate, creative, and driven individuals to help us redefine e-commerce. Be part of our journey!',
        jobs: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/careers`);
                const json = await res.json();
                if (res.ok) {
                    setData(json);
                }
            } catch (error) {
                console.error("Error fetching careers data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCareers();
    }, []);

    const benefits = [
        { icon: MdLightbulb, title: 'Innovation', desc: 'Encouraging fresh ideas to solve complex problems.' },
        { icon: MdRocketLaunch, title: 'Impact', desc: 'Your work shapes the experience for thousands.' },
        { icon: MdTrendingUp, title: 'Growth', desc: 'Invested in your learning and clear career paths.' },
        { icon: MdGroups, title: 'Culture', desc: 'Incisive, fun, and fast-paced environment.' },
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-tss-gray-200 border-t-tss-red rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            <SEO pageName="careers" />

            {/* Hero Section */}
            <div className="bg-tss-gray-100 py-24 md:py-32 border-b border-tss-gray-200">
                <div className="tss-container text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black text-tss-black uppercase tracking-tight mb-8 leading-tight">
                        {data.heroTitle}
                    </h1>
                    <p className="text-[14px] md:text-[16px] text-tss-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                        {data.heroDescription}
                    </p>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="tss-container py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {benefits.map((benefit, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-20 h-20 bg-tss-gray-50 rounded-sm flex items-center justify-center mx-auto mb-8 group-hover:bg-tss-black group-hover:text-white transition-all shadow-sm">
                                <benefit.icon size={32} />
                            </div>
                            <h3 className="text-[14px] font-black text-tss-black uppercase tracking-widest mb-4">{benefit.title}</h3>
                            <p className="text-[11px] font-bold text-tss-gray-500 uppercase tracking-widest leading-relaxed">
                                {benefit.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Open Positions */}
            <div className="bg-tss-gray-50 py-24 border-y border-tss-gray-200">
                <div className="tss-container max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-tss-black uppercase tracking-[0.2em] mb-4">Current Openings</h2>
                        <div className="w-20 h-2 bg-tss-red mx-auto"></div>
                    </div>

                    <div className="space-y-6">
                        {data.jobs.length === 0 ? (
                            <div className="p-16 bg-white border border-tss-gray-200 text-center rounded-sm">
                                <MdWork className="mx-auto mb-6 text-tss-gray-100" size={64} />
                                <p className="text-[14px] font-black text-tss-gray-400 uppercase tracking-widest">No positions currently open. Check back soon!</p>
                            </div>
                        ) : (
                            data.jobs.map((job, index) => (
                                <div key={index} className="bg-white border border-tss-gray-200 p-8 rounded-sm hover:shadow-2xl transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex gap-8 items-center">
                                        <div className="w-16 h-16 bg-tss-gray-50 rounded-sm flex items-center justify-center text-tss-gray-400 group-hover:bg-tss-red group-hover:text-white transition-colors">
                                            <MdWork size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-[18px] font-black text-tss-black uppercase tracking-tight mb-2 group-hover:text-tss-red transition-colors">{job.title}</h3>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="text-[9px] font-black text-tss-gray-400 border border-tss-gray-200 px-3 py-1 uppercase tracking-widest rounded-full">{job.department}</span>
                                                <span className="text-[9px] font-black text-tss-gray-400 border border-tss-gray-200 px-3 py-1 uppercase tracking-widest rounded-full">{job.location}</span>
                                                <span className="text-[9px] font-black text-tss-red bg-red-50 border border-red-100 px-3 py-1 uppercase tracking-widest rounded-full">{job.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="tss-button-primary px-10 flex items-center gap-3">
                                        APPLY NOW
                                        <MdArrowForward size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Resume Drop */}
                    <div className="mt-20 bg-tss-black text-white p-12 md:p-16 rounded-sm relative overflow-hidden text-center md:text-left">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="max-w-xl">
                                <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Don't see a fit?</h3>
                                <p className="text-[12px] font-bold uppercase tracking-widest opacity-60 leading-loose">
                                    We are always on the lookout for talented mavericks. Drop your resume in our database and we'll reach out when the right opportunity drops.
                                </p>
                            </div>
                            <a
                                href="mailto:careers@nazrakart.com"
                                className="bg-tss-red text-white px-12 py-5 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-xl active:scale-95"
                            >
                                SEND RESUME
                            </a>
                        </div>
                        <MdRocketLaunch className="absolute -right-20 -bottom-20 text-white/5 opacity-10" size={400} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;
