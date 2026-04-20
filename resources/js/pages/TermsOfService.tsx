import { Head, Link } from '@inertiajs/react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Head title="Terms of Service - NgeTrack-Yuk" />
            
            <main className="max-w-4xl mx-auto px-6 py-16">
                <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium mb-8 inline-block">
                    &larr; Back to Home
                </Link>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6 text-lg leading-relaxed">
                    <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
                    <p>
                        By registering and using the NgeTrack-Yuk application, you agree to comply with these terms, as well as the official rules and regulations established by the management of Mount Papandayan and the Ministry of Environment and Forestry (SIMAKSI).
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8">2. Hiker Responsibilities</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You must provide accurate health, identity, and emergency contact information during registration.</li>
                        <li>You are required to scan the QR checkpoints along your route to maintain an accurate digital log. Failure to do so may result in false SOS alerts.</li>
                        <li>You must officially "Check-out" by scanning the final basecamp QR code upon your safe descent.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8">3. Limitation of Liability</h2>
                    <p>
                        Hiking is an inherently dangerous outdoor activity. While NgeTrack-Yuk is designed to enhance monitoring and expedite Search and Rescue (SAR) responses, the application does not guarantee absolute safety. The developers, park management, and forestry officers cannot be held legally liable for injuries, loss of property, or fatal accidents occurring on the trail.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8">4. Service Availability</h2>
                    <p>
                        The application relies on mobile network connectivity. In the event of "blank spots" or network outages, hikers are expected to report their status to passing rangers or via HT (Handy Talkie) frequencies, allowing officers to perform a Manual HT Check-in on your behalf.
                    </p>
                </div>
            </main>
        </div>
    );
}