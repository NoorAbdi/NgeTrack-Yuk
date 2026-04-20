import { Head, Link } from '@inertiajs/react';

export default function LearnMore() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Head title="Learn More - NgeTrack-Yuk" />
            
            <main className="max-w-4xl mx-auto px-6 py-16">
                <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium mb-8 inline-block">
                    &larr; Back to Home
                </Link>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-6">About NgeTrack-Yuk</h1>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6 text-lg leading-relaxed">
                    <p>
                        <strong>NgeTrack-Yuk</strong> is a modern, digital hiking logbook and safety monitoring system designed to revolutionize eco-tourism management in Indonesia, starting with Mount Papandayan.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-gray-900 mt-8">How It Works</h2>
                    <p>
                        We replace outdated paper-based ticketing with a seamless QR code tracking mechanism. Hikers register their trip details and emergency contacts securely online. During the hike, users simply scan static QR checkpoints located along the trail using the In-App Scanner. This updates their real-time location on the Forestry Officer's dashboard without requiring heavy mobile data usage.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-gray-900 mt-8">Safety First</h2>
                    <p>
                        Your safety is our priority. Our system calculates your elapsed time and descent deadline. If a hiker is significantly overdue, an Asynchronous Background Worker automatically dispatches an SOS alert to the Forestry Officers' Telegram group, drastically reducing Search and Rescue (SAR) response times.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8">Gamified Experience</h2>
                    <p>
                        Hiking is an achievement. By consistently scanning checkpoints and successfully completing your descent, you earn digital badges on your profile, encouraging responsible hiking practices and trail compliance.
                    </p>
                </div>
            </main>
        </div>
    );
}