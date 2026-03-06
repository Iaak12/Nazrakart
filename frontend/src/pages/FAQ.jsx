import React, { useState, useEffect } from 'react';
import { MdAdd, MdRemove, MdQuestionAnswer, MdSearch, MdArrowForward } from 'react-icons/md';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import DynamicHeading from '../components/DynamicHeading';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-tss-gray-200 border-t-tss-red rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            <SEO pageName="faq" />

            {/* Header */}
            <div className="bg-tss-black text-white py-20 md:py-32 mb-16 relative overflow-hidden">
                <div className="tss-container relative z-10 text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8">Got <span className="text-tss-red">Questions?</span></h1>
                    <p className="text-[14px] font-bold uppercase tracking-[0.2em] opacity-60 mb-12">We've got the answers you're looking for.</p>

                    <div className="relative max-w-2xl mx-auto">
                        <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
                        <input
                            type="text"
                            placeholder="SEARCH FOR TOPICS (E.G. SHIPPING, RETURNS)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/10 border-2 border-white/20 px-16 py-5 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-white transition-all rounded-sm"
                        />
                    </div>
                </div>
                <MdQuestionAnswer className="absolute -right-20 -bottom-20 text-white/5" size={400} />
            </div>

            <div className="tss-container max-w-4xl">
                {filteredFaqs.length === 0 ? (
                    <div className="text-center py-20 bg-tss-gray-50 border border-tss-gray-100 rounded-sm">
                        <p className="text-[14px] font-black text-tss-gray-400 uppercase tracking-widest">No results found for "{searchTerm}"</p>
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-tss-red font-black text-[12px] uppercase tracking-widest hover:underline">Clear Search</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredFaqs.map((faq, index) => (
                            <div
                                key={faq._id || index}
                                className={`border rounded-sm transition-all duration-300 ${openIndex === index ? 'border-tss-red ring-1 ring-tss-red/20' : 'border-tss-gray-200 hover:border-tss-gray-400'}`}
                            >
                                <button
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                >
                                    <DynamicHeading
                                        tag={faq.questionTag || 'span'}
                                        className={`text-[14px] md:text-[16px] font-black uppercase tracking-tight transition-colors ${openIndex === index ? 'text-tss-red' : 'text-tss-black group-hover:text-tss-red'}`}
                                    >
                                        {faq.question}
                                    </DynamicHeading>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center transition-all ${openIndex === index ? 'bg-tss-red text-white' : 'bg-tss-gray-100 text-tss-gray-400'}`}>
                                        {openIndex === index ? <MdRemove size={20} /> : <MdAdd size={20} />}
                                    </div>
                                </button>

                                {openIndex === index && (
                                    <div className="p-6 md:p-8 pt-0 border-t border-tss-gray-100 animate-fadeIn">
                                        <div
                                            className="text-[14px] font-bold text-tss-gray-500 leading-loose rich-text-content"
                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-20 p-10 md:p-14 bg-tss-gray-50 rounded-sm border border-tss-gray-200 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-black text-tss-black uppercase tracking-[0.1em] mb-2">Still Stuck?</h2>
                        <p className="text-[12px] font-bold text-tss-gray-400 uppercase tracking-widest leading-relaxed">Our friendly support team is always just a click away.</p>
                    </div>
                    <Link to="/contact" className="tss-button-primary whitespace-nowrap px-12 flex items-center gap-3">
                        CONTACT SUPPORT
                        <MdArrowForward size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
