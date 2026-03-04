import React, { useState } from 'react';
import { MdEmail, MdPhone, MdLocationOn, MdSend, MdCheck } from 'react-icons/md';
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebookF } from 'react-icons/fa';

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
                alert('Failed to send message. Please try again later.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error connecting to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: MdEmail,
            title: 'Email Us',
            details: storeSettings.storeEmail,
            subtext: 'We reply within 24 hours'
        },
        {
            icon: MdPhone,
            title: 'Call Us',
            details: storeSettings.storePhone,
            subtext: 'Mon-Fri, 9am-6pm EST'
        },
        {
            icon: MdLocationOn,
            title: 'Visit Us',
            details: '123 Commerce Street',
            subtext: 'Shop City, SC 12345'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Have a question or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="text-center p-8 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                    <info.icon className="text-gray-700" size={28} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                                <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                                <p className="text-gray-500 text-sm">{info.subtext}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                            <p className="text-gray-500 mb-8">Fill out the form below and we'll get back to you shortly.</p>

                            {submitted ? (
                                <div className="p-8 rounded-3xl bg-green-50 border border-green-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <MdCheck className="text-green-600" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-green-900">Message Sent!</h3>
                                            <p className="text-green-700">We'll get back to you within 24 hours.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                                            placeholder="How can we help?"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={6}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all resize-none"
                                            placeholder="Your message..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <MdSend size={20} />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Info Side */}
                        <div className="lg:pl-8">
                            <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 h-full">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>

                                <div className="space-y-6 mb-10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Premium Quality</h4>
                                            <p className="text-gray-500">All our products are carefully selected for quality and durability.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Fast Shipping</h4>
                                            <p className="text-gray-500">Free express shipping on orders over $50 with real-time tracking.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Dedicated Support</h4>
                                            <p className="text-gray-500">Our team is available 24/7 to assist you with any questions.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                                            <p className="text-gray-500">30-day hassle-free return policy for all purchases.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-200">
                                    <p className="text-gray-700 font-medium mb-4">Follow us</p>
                                    <div className="flex items-center gap-3">
                                        <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all">
                                            <FaFacebookF size={16} />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all">
                                            <FaTwitter size={16} />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all">
                                            <FaInstagram size={16} />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all">
                                            <FaLinkedin size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section (Placeholder) */}
            <section className="h-96 bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <MdLocationOn className="text-gray-400 mx-auto mb-4" size={48} />
                        <p className="text-gray-500">Interactive map would go here</p>
                        <p className="text-gray-400 text-sm">123 Commerce Street, Shop City, SC 12345</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
