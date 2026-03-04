import React, { useState, useEffect } from 'react';
import { MdWork, MdArrowForward } from 'react-icons/md';

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

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-wider">{data.heroTitle}</h1>
                    <p className="text-lg text-gray-600">{data.heroDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider">Innovation</h3>
                        <p className="text-sm text-gray-600">We encourage fresh ideas and out-of-the-box thinking to solve complex problems.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider">Impact</h3>
                        <p className="text-sm text-gray-600">Your work directly shapes the shopping experience for thousands of customers.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider">Growth</h3>
                        <p className="text-sm text-gray-600">We invest in our team members with learning opportunities and clear career paths.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider">Culture</h3>
                        <p className="text-sm text-gray-600">An inclusive, fun, and fast-paced environment where collaboration is key.</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-wider text-center">Open Positions</h2>
                    <div className="space-y-4">
                        {data.jobs.map((job, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-red-50 text-tss-red flex items-center justify-center flex-shrink-0">
                                        <MdWork size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">{job.department}</span>
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">{job.location}</span>
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">{job.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md font-bold uppercase tracking-widest hover:bg-tss-red transition-colors w-full sm:w-auto">
                                    Apply Now <MdArrowForward />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto text-center mt-16 bg-red-50 p-8 rounded-2xl border border-red-100">
                    <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-wider">Don't see a fit?</h2>
                    <p className="text-gray-600 mb-6 font-medium">
                        We are continually growing. Send us your resume at <a href="mailto:careers@nazrakart.com" className="text-tss-red font-bold hover:underline">careers@nazrakart.com</a> and we'll reach out when a matching position opens.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Careers;
