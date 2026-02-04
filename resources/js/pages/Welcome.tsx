import { Link, Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MapPin, Smile } from 'lucide-react'; // Ikon untuk fitur

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to NgeTrack-Yuk" />
            
            <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100 font-sans selection:bg-orange-100 selection:text-orange-900">
                
                {/* --- NAVIGATION BAR --- */}
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-neutral-950/80 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        {/* Logo Image */}
                        <img
                            src="/images/logo.png"
                            alt="NgeTrack-Yuk Logo" 
                            className="h-10 w-auto"
                        />
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">NgeTrack-Yuk</span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href="/dashboard">
                                <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium hover:text-orange-600 transition-colors">
                                    Log in
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                                        Register Now
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* --- HERO SECTION --- */}
                <main className="pt-32 pb-16 px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
                            Your Safety Partner on <br />
                            <span className="text-orange-600">Every Peak.</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Experience the freedom of hiking with peace of mind. 
                            Our digital logbook system ensures your journey is tracked, secure, and safe 
                            from the basecamp to the summit and back.
                        </p>
                        
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            {auth.user ? (
                                <Link href="/register-hike">
                                    <Button size="lg" className="w-full sm:w-auto bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
                                        Start Your Adventure
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/register">
                                    <Button size="lg" className="w-full sm:w-auto bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
                                        Join for Free
                                    </Button>
                                </Link>
                            )}
                            <Link href="#features">
                                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* --- FEATURES GRID --- */}
                    <div id="features" className="mt-24 mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1: Safety */}
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800">
                            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 dark:bg-blue-900/30 dark:text-blue-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Safety First</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Real-time monitoring allows park rangers to ensure every hiker is accounted for. Never worry about getting lost unnoticed.
                            </p>
                        </div>

                        {/* Feature 2: Tracking */}
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800">
                            <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 dark:bg-orange-900/30 dark:text-orange-400">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">QR Checkpoints</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Simple and fast check-in at every post. Just scan the QR code to log your progress instantly without manual paperwork.
                            </p>
                        </div>

                        {/* Feature 3: Comfort */}
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800">
                            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 dark:bg-green-900/30 dark:text-green-400">
                                <Smile className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Hike with Comfort</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Focus on the view, not the admin. Our seamless digital system removes the hassle of manual registration queues.
                            </p>
                        </div>
                    </div>
                </main>

                {/* --- FOOTER --- */}
                <footer className="border-t border-gray-200 dark:border-neutral-800 mt-auto py-12 px-6 bg-white dark:bg-neutral-950">
                    <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <p>&copy; {new Date().getFullYear()} NgeTrack-Yuk. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms of Service</a>
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Contact Rangers</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}