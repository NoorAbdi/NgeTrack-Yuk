import { Head, Link } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Head title="Privacy Policy - NgeTrack-Yuk" />
            
            <main className="max-w-4xl mx-auto px-6 py-16">
                <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium mb-8 inline-block">
                    &larr; Back to Home
                </Link>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6 text-lg leading-relaxed">
                    <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
                    <p>
                        When you register for a hike using NgeTrack-Yuk, we collect personal information including your name, email address, phone number, and emergency contact details. During the hike, we collect timestamped location data exclusively when you manually scan a designated QR checkpoint.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8">2. Data Security & AES-256 Encryption</h2>
                    <p>
                        We take your privacy seriously. Highly sensitive information, specifically your emergency contact names and phone numbers, are secured using <strong>AES-256 Encryption</strong> at rest in our database. This ensures that your most private data is unreadable to unauthorized parties and is only decrypted temporarily during emergency Search and Rescue (SAR) operations.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8">3. How We Use Your Data</h2>
                    <p>
                        Your data is used strictly for operational and safety purposes. We use checkpoint logs to monitor trail capacity, ensure you are not overdue on your descent, and coordinate emergency responses. Anonymized, aggregated data may be used by park management for conservation planning and trail maintenance.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8">4. Location Tracking Limitations</h2>
                    <p>
                        NgeTrack-Yuk is <strong>not</strong> a continuous GPS tracker. We do not track your device's location in the background. Your location is only updated in our system when you actively scan a QR code at a checkpoint.
                    </p>
                </div>
            </main>
        </div>
    );
}