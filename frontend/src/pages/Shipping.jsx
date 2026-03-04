import React, { useState } from 'react';
import { MdLocalShipping, MdAccessTime, MdPublic, MdOutlinePolicy, MdSearch } from 'react-icons/md';

const Shipping = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);

    const handleTrackOrder = (e) => {
        e.preventDefault();
        if (trackingNumber.trim()) {
            // Simulate tracking API call
            setTrackingResult({
                status: 'In Transit',
                estimatedDelivery: 'Thu, Oct 26',
                currentLocation: 'Mumbai Logistics Hub'
            });
        }
    };

    const policies = [
        {
            icon: <MdLocalShipping className="w-8 h-8 text-tss-red" />,
            title: "Free Shipping",
            description: "Enjoy free standard shipping on all orders over ₹999 within India. For orders below, a flat rate of ₹50 applies."
        },
        {
            icon: <MdAccessTime className="w-8 h-8 text-tss-red" />,
            title: "Delivery Times",
            description: "Orders usually dispatch in 24-48 hours. Metro cities receive orders in 2-4 days, while rest of India takes 4-7 days."
        },
        {
            icon: <MdPublic className="w-8 h-8 text-tss-red" />,
            title: "International Shipping",
            description: "Currently, we only ship across India. International shipping will be launched soon. Stay tuned to our social media!"
        },
        {
            icon: <MdOutlinePolicy className="w-8 h-8 text-tss-red" />,
            title: "Shipping Partners",
            description: "We partner with trusted couriers like BlueDart, Delhivery, and XpressBees to ensure safe and timely delivery."
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-6">
                        Shipping & Tracking
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        Everything you need to know about our shipping policies, delivery times, and order tracking.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Track Order Section */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight mb-4">
                        Track Your Order
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                        Enter your AWB (Waybill) number or Order ID below to get real-time tracking updates.
                    </p>

                    <form onSubmit={handleTrackOrder} className="max-w-md mx-auto relative mb-6">
                        <input
                            type="text"
                            placeholder="Enter Tracking Number..."
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red focus:ring-1 focus:ring-tss-red transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-tss-red text-white flex items-center justify-center rounded-full hover:bg-red-700 transition-colors"
                        >
                            <MdSearch size={24} />
                        </button>
                    </form>

                    {trackingResult && (
                        <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6 text-left">
                            <h3 className="font-bold text-green-800 mb-4 uppercase tracking-wider text-sm border-b border-green-200 pb-2">Tracking Result (Simulated)</h3>
                            <div className="space-y-2 text-sm text-green-900">
                                <p><span className="font-bold">Status:</span> {trackingResult.status}</p>
                                <p><span className="font-bold">Est. Delivery:</span> {trackingResult.estimatedDelivery}</p>
                                <p><span className="font-bold">Location:</span> {trackingResult.currentLocation}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Policy Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {policies.map((policy, index) => (
                        <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="bg-red-50 p-3 rounded-full flex-shrink-0">
                                {policy.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{policy.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{policy.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Note */}
                <div className="mt-12 text-center p-6 bg-gray-100 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm">
                        <strong>Note:</strong> During seasonal sales and promotional events, slight delays in dispatch and delivery may be experienced. We appreciate your patience.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Shipping;
