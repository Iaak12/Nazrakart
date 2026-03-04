import React, { useState, useEffect } from 'react';

const Privacy = () => {
    const [data, setData] = useState({
        content: '',
        lastUpdated: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrivacy = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/privacy`);
                const json = await res.json();
                if (res.ok) {
                    setData(json);
                }
            } catch (error) {
                console.error("Error fetching privacy data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrivacy();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 border-b border-gray-100 pb-8 text-center sm:text-left">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-wider">Privacy Policy</h1>
                    <p className="text-gray-500 font-medium">Effective Date: {data.lastUpdated}</p>
                </div>

                <div className="prose prose-gray max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wider prose-h2:text-2xl prose-h3:text-xl"
                    dangerouslySetInnerHTML={{ __html: data.content }}>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
