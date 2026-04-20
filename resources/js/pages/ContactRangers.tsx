import { Head, Link } from '@inertiajs/react';

export default function ContactRangers() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Head title="Contact Rangers - NgeTrack-Yuk" />
            
            <main className="max-w-4xl mx-auto px-6 py-16">
                <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium mb-8 inline-block">
                    &larr; Back to Home
                </Link>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Forestry Rangers</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {/* Emergency Card */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-2xl shadow-sm">
                        <h2 className="text-2xl font-bold text-red-700 mb-4">Emergency Assistance</h2>
                        <p className="text-red-900 mb-6">
                            If you are currently on the mountain and facing a life-threatening emergency, injury, or are lost, please use the contacts below immediately.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center text-lg font-semibold text-red-800">
                                <span className="mr-3">📞</span> Mount Papandayan SAR: +62 812-0941-2653
                            </li>
                            <li className="flex items-center text-lg font-semibold text-red-800">
                                <span className="mr-3">📻</span> Radio Frequency (HT): 201.92 kHz
                            </li>
                        </ul>
                    </div>

                    {/* General Inquiry Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">General Inquiries</h2>
                        <p className="text-gray-600 mb-6">
                            For questions about the NgeTrack-Yuk app, permit extensions, or reporting bugs in the system.
                        </p>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-center text-lg">
                                <span className="mr-3">✉️</span> officer@papandayan.com
                            </li>
                            <li className="flex items-center text-lg">
                                <span className="mr-3">📍</span> Basecamp Camp Tatang, Mount Papandayan, West Java.
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}