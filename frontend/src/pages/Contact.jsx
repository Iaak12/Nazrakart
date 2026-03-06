import React, { useState } from 'react';
import { MdEmail, MdPhone, MdLocationOn, MdSend, MdCheck, MdHeadsetMic, MdSupportAgent, MdChat } from 'react-icons/md';
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebookF } from 'react-icons/fa';
import SEO from '../components/SEO';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [storeSettings, setStoreSettings] = useState({
        storeEmail: 'hello@nazrakart.com',
        storePhone: '+1 (555) 123-4567'
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
                if (res.ok) {
                    const data = await res.json();
                    setStoreSettings(data);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                console.error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: MdEmail,
            title: 'Email Us',
            details: storeSettings.storeEmail,
            subtext: 'We reply within 24 hours',
            color: 'text-blue-500'
        },
        {
            icon: MdHeadsetMic,
            title: 'Call Us',
            details: storeSettings.storePhone,
            subtext: 'Mon-Sun, 9am-10pm IST',
            color: 'text-tss-green'
        },
        {
            icon: MdChat,
            title: 'Live Chat',
            details: 'Click icon in corner',
            subtext: 'Instant response',
            color: 'text-tss-red'
        }
    ];

    return (
        <div className="bg-white min-h-screen pb-24">
            <SEO pageName="contact" />

            {/* Header */}
            <div className="bg-tss-gray-100 py-20 border-b border-tss-gray-200 mb-16">
                <div className="tss-container text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-tss-black uppercase tracking-tight mb-6">Need Help? <span className="text-tss-red">Contact Us</span></h1>
                    <p className="text-[14px] font-bold text-tss-gray-500 uppercase tracking-widest leading-loose">
                        Whether you have a question about our latest drops, shipping updates, or just want to say hi, we're here for you.
                    </p>
                </div>
            </div>

            <div className="tss-container">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="bg-tss-gray-50 p-10 rounded-sm border border-tss-gray-100 group hover:shadow-2xl hover:bg-white transition-all cursor-default">
                            <div className={`w-16 h-16 rounded-sm bg-white flex items-center justify-center mb-8 shadow-sm group-hover:bg-tss-black group-hover:text-white transition-all ${info.color}`}>
                                <info.icon size={28} />
                            </div>
                            <h3 className="text-[16px] font-black text-tss-black uppercase tracking-widest mb-2">{info.title}</h3>
                            <p className="text-[14px] font-black text-tss-black mb-1">{info.details}</p>
                            <p className="text-[10px] font-bold text-tss-gray-400 uppercase tracking-widest">{info.subtext}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
                    {/* Form Side */}
                    <div className="bg-white p-10 lg:p-14 border border-tss-gray-200 shadow-2xl rounded-sm">
                        <h2 className="text-3xl font-black text-tss-black uppercase tracking-tight mb-4">Send Message</h2>
                        <div className="w-16 h-2 bg-tss-red mb-10"></div>

                        {submitted ? (
                            <div className="bg-green-50 border-2 border-tss-green p-10 rounded-sm text-center">
                                <MdCheck className="text-tss-green mx-auto mb-4" size={48} />
                                <h3 className="text-xl font-black text-tss-black uppercase tracking-widest mb-2">Message Received!</h3>
                                <p className="text-[12px] font-bold text-tss-gray-500 uppercase tracking-widest">Our experts will get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-tss-black uppercase tracking-widest">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-tss-gray-50 border-2 border-tss-gray-100 p-4 font-bold text-tss-black text-[13px] focus:outline-none focus:border-tss-black transition-all"
                                            placeholder="ENTER NAME"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-tss-black uppercase tracking-widest">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-tss-gray-50 border-2 border-tss-gray-100 p-4 font-bold text-tss-black text-[13px] focus:outline-none focus:border-tss-black transition-all"
                                            placeholder="ENTER EMAIL"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-tss-black uppercase tracking-widest">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-tss-gray-50 border-2 border-tss-gray-100 p-4 font-bold text-tss-black text-[13px] focus:outline-none focus:border-tss-black transition-all"
                                        placeholder="WHAT'S THIS ABOUT?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-tss-black uppercase tracking-widest">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-tss-gray-50 border-2 border-tss-gray-100 p-4 font-bold text-tss-black text-[13px] focus:outline-none focus:border-tss-black transition-all resize-none"
                                        placeholder="YOUR ENQUIRY..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-tss-black text-white py-5 font-black text-[12px] uppercase tracking-[0.3em] hover:bg-tss-red transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? 'SENDING...' : (
                                        <>
                                            SEND MESSAGE
                                            <MdSend size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info/Social Side */}
                    <div className="flex flex-col gap-10">
                        <div className="bg-tss-black text-white p-10 lg:p-14 rounded-sm flex-1 relative overflow-hidden">
                            <h3 className="text-2xl font-black uppercase tracking-widest mb-10 relative z-10">Connect With The Souled Community</h3>
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-start gap-6">
                                    <div className="w-1 w-1 bg-tss-red h-full"></div>
                                    <div>
                                        <h4 className="text-[14px] font-black uppercase tracking-widest mb-2">Our HQ</h4>
                                        <p className="text-[12px] font-bold text-white/60 uppercase tracking-widest leading-loose">
                                            123 Fashion Street, Creative Plaza<br />
                                            Mumbai, Maharashtra - 400001
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Follow The Vibe</p>
                                    <div className="flex gap-4">
                                        {[FaInstagram, FaFacebookF, FaTwitter, FaLinkedin].map((Icon, i) => (
                                            <a key={i} href="#" className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center hover:bg-tss-red hover:scale-110 transition-all border border-white/10">
                                                <Icon size={20} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <MdLocationOn className="absolute -right-20 -bottom-20 text-white/5" size={400} />
                        </div>

                        <div className="bg-tss-gray-50 p-10 border border-tss-gray-200 rounded-sm">
                            <h3 className="text-[12px] font-black text-tss-black uppercase tracking-widest mb-4">Customer Support Hours</h3>
                            <p className="text-[11px] font-bold text-tss-gray-500 uppercase tracking-widest leading-loose mb-6">
                                Monday to Sunday: 9:00 AM to 10:00 PM (IST)<br />
                                We are here to help you every day of the week!
                            </p>
                            <div className="p-4 bg-tss-green/5 border-l-4 border-tss-green">
                                <p className="text-[10px] font-black text-[#117a7a] uppercase tracking-widest">Typical response time: Under 2 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
