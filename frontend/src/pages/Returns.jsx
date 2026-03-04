import React from 'react';
import { MdAssignmentReturn, MdLocalShipping, MdAutorenew, MdWarning } from 'react-icons/md';

const Returns = () => {
    const policies = [
        {
            icon: <MdAssignmentReturn className="w-8 h-8 text-tss-red" />,
            title: "15-Day Return Window",
            description: "You have 15 days from the date of delivery to initiate a return or exchange for your purchased items."
        },
        {
            icon: <MdLocalShipping className="w-8 h-8 text-tss-red" />,
            title: "Return Shipping",
            description: "For standard returns, a nominal reverse shipping fee may apply. If the product received is defective, return shipping is completely free."
        },
        {
            icon: <MdAutorenew className="w-8 h-8 text-tss-red" />,
            title: "Easy Refunds",
            description: "Once we receive and inspect your returned item, your refund will be processed to your original payment method within 5-7 business days."
        },
        {
            icon: <MdWarning className="w-8 h-8 text-tss-red" />,
            title: "Condition of Items",
            description: "Items must be unused, unwashed, and returned in their original packaging with all tags intact. We reserve the right to reject returns that do not meet these criteria."
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-6">
                        Return & Exchange Policy
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        We want you to love what you ordered. If you are not completely satisfied, here is everything you need to know about our return process.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Policy Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {policies.map((policy, index) => (
                        <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex items-start gap-4">
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

                {/* Detailed Guidelines */}
                <div className="bg-white rounded-xl p-8 lg:p-12 shadow-sm border border-gray-100 space-y-12">

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-tss-red inline-block"></span>
                            How to Initiate a Return
                        </h2>
                        <ol className="list-decimal list-inside space-y-4 text-gray-600 ml-4">
                            <li>Log in to your NazraKart account and go to the <strong>Orders</strong> section.</li>
                            <li>Select the order you wish to return and click on "Request Return/Exchange".</li>
                            <li>Choose the item(s) you want to return and specify the reason.</li>
                            <li>Once submitted, you will receive an email confirmation with return instructions and schedule.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-tss-red inline-block"></span>
                            Non-Returnable Items
                        </h2>
                        <p className="text-gray-600 mb-4">
                            For hygiene and safety reasons, the following items cannot be returned or exchanged:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Underwear, socks, and intimate apparel</li>
                            <li>Face masks</li>
                            <li>Clearance or sale items marked as "Final Sale"</li>
                            <li>Gift Cards</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-tss-red inline-block"></span>
                            Exchanges
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Need a different size or color? We recommend initiating a return for the original item and placing a new order for the desired product. This ensures you get your new item as quickly as possible before stock runs out. Alternatively, you can request an exchange through the Orders portal, subject to inventory availability.
                        </p>
                    </section>

                </div>

                {/* Contact Support */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Having trouble with your return?</p>
                    <a href="/contact" className="inline-block px-6 py-3 border border-tss-red text-tss-red font-bold rounded-md hover:bg-red-50 transition-colors uppercase tracking-widest text-sm">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Returns;
