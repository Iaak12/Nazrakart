import React, { useState, useEffect } from 'react';

const Terms = () => {
    const [data, setData] = useState({
        content: '',
        lastUpdated: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/terms`);
                const json = await res.json();
                if (res.ok) {
                    setData(json);
                }
            } catch (error) {
                console.error("Error fetching terms data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTerms();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 border-b border-gray-100 pb-8 text-center sm:text-left">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-wider">Terms & Conditions</h1>
                    <p className="text-gray-500 font-medium">Last updated: {data.lastUpdated}</p>
                </div>

                <div className="prose prose-gray max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wider prose-h2:text-2xl prose-h3:text-xl"
                    dangerouslySetInnerHTML={{ __html: data.content }}>
                </div>
            </div>
        </div>
    );
};

export default Terms;
