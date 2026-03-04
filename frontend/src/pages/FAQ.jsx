import React, { useState, useEffect } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/faqs`);
                const data = await res.json();
                if (res.ok) {
                    setFaqs(data);
                }
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-600">
                        Find answers to common questions about our products, shipping, returns, and more.
                    </p>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading FAQs...</div>
                    ) : faqs.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                            No frequently asked questions available at the moment.
                        </div>
                    ) : (
                        faqs.map((faq, index) => (
                            <div
                                key={faq._id || index}
                                className={`bg-white rounded-xl border ${openIndex === index ? 'border-tss-red/30 shadow-md shadow-red-500/5' : 'border-gray-200 shadow-sm'} overflow-hidden transition-all duration-300`}
                            >
                                <button
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                >
                                    <span className={`font-bold text-lg ${openIndex === index ? 'text-tss-red' : 'text-gray-900'}`}>
                                        {faq.question}
                                    </span>
                                    <span className={`ml-6 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-red-50 text-tss-red' : 'bg-gray-50 text-gray-400'}`}>
                                        {openIndex === index ? <MdRemove size={20} /> : <MdAdd size={20} />}
                                    </span>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>

                <div className="mt-16 text-center bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h2>
                    <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <a href="/contact" className="inline-block px-8 py-3 bg-tss-red text-white font-bold rounded-md hover:bg-red-700 transition-colors uppercase tracking-widest text-sm">
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
