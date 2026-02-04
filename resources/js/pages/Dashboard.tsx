import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react'; 
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Activity, MapPin, Mountain, CheckCircle, Trophy, History } from 'lucide-react';

// Definisi Tipe Data
interface CurrentHike {
    hike_registration_id: string;
    mountain_name: string;
    status: string;
    last_checkpoint: string;
    direction: string;
    started_at: string;
}

interface UserBadge {
    id: number;
    name: string;
    description: string;
    icon: string;
    unlocked_at: string;
}

interface HikeHistory {
    id: number;
    mountain_name: string;
    completed_date: string;
    duration: string;
}

interface DashboardProps {
    currentHike?: CurrentHike | null;
    badges: UserBadge[];
    hikeHistory: HikeHistory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ currentHike, badges, hikeHistory }: DashboardProps) {
    const { flash } = usePage().props as any;
    const [showNewHikeModal, setShowNewHikeModal] = useState(false);
    
    const [activeTab, setActiveTab] = useState<'badges' | 'history'>('badges');

    useEffect(() => {
        if (flash?.new_hike_id) {
            setShowNewHikeModal(true);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* --- POP-UP DIALOG --- */}
            <Dialog open={showNewHikeModal} onOpenChange={setShowNewHikeModal}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-500">
                            <CheckCircle className="h-6 w-6" />
                            Registration Successful!
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Your hike has been registered. Please save your Hike ID below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 my-2">
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider font-semibold">Your Hike ID</p>
                            <p className="text-3xl font-mono font-bold tracking-widest text-gray-900 dark:text-white select-all">
                                {flash?.new_hike_id}
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button type="button" onClick={() => setShowNewHikeModal(false)} className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                            I Have Saved It
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                
                {/* --- Tombol Register (PERBAIKAN DARK/LIGHT MODE) --- */}
                {!currentHike && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div>
                            {/* PERBAIKAN: Teks judul sudah oke */}
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Ready for an Adventure?
                            </h3>
                            {/* PERBAIKAN: Mengubah 'text-muted-foreground' menjadi 'text-gray-700' agar lebih gelap di light mode */}
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                Register your hike now to get your unique ID and start tracking.
                            </p>
                        </div>
                        <Button asChild size="lg" className='bg-black font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm'>
                            <Link href="/register-hike">Register New Hike</Link>
                        </Button>
                    </div>
                )}

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    
                    {/* --- KARTU 1: STATUS --- */}
                    {currentHike ? (
                        <Card className="border-l-4 border-l-orange-500 shadow-sm bg-white dark:bg-gray-800 border-y-gray-200 border-r-gray-200 dark:border-y-gray-700 dark:border-r-gray-700">
                            <CardHeader className="pb-2">
                                {/* PERBAIKAN: Judul kartu lebih gelap di light mode */}
                                <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex justify-between">
                                    Current Status
                                    <Activity className="h-4 w-4 text-orange-500" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                    {currentHike.status}
                                </div>
                                <div className="mt-1 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                                    <Mountain className="mr-1 h-4 w-4" />
                                    {currentHike.mountain_name}
                                </div>
                                <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-100 dark:border-orange-900/50">
                                    {/* PERBAIKAN: Label ID lebih gelap */}
                                    <p className="text-[10px] font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider">Active ID</p>
                                    <p className="text-lg font-mono font-bold text-orange-950 dark:text-orange-100 leading-none mt-1">
                                        {currentHike.hike_registration_id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="relative aspect-video rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-center p-4 shadow-sm">
                            <Activity className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-base font-semibold text-gray-900 dark:text-white">No Active Hike</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your status will appear here.</p>
                        </div>
                    )}

                    {/* --- KARTU 2: LOKASI --- */}
                    {currentHike ? (
                        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-white dark:bg-gray-800 border-y-gray-200 border-r-gray-200 dark:border-y-gray-700 dark:border-r-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex justify-between">
                                    Last Checkpoint
                                    <MapPin className="h-4 w-4 text-blue-500" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                    {currentHike.last_checkpoint}
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className={`px-3 py-1 text-xs rounded-full font-bold ${currentHike.direction === 'Ascent' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'}`}>
                                        {currentHike.direction === '-' ? 'Not Started' : currentHike.direction}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="relative aspect-video rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-center p-4 shadow-sm">
                            <MapPin className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-base font-semibold text-gray-900 dark:text-white">Location Tracker</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Scan QR codes to track location.</p>
                        </div>
                    )}

                    {/* --- KARTU 3: ACHIEVEMENTS & HISTORY (TAB) --- */}
                    <Card className="shadow-sm flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                    Your Journey
                                </CardTitle>
                                <div className="flex bg-gray-100 dark:bg-gray-900/50 rounded-lg p-1">
                                    {/* PERBAIKAN: Teks tab tidak aktif dibuat lebih gelap dan kontras */}
                                    <button 
                                        onClick={() => setActiveTab('badges')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'badges' ? 'bg-white shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                    >
                                        Badges
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('history')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                    >
                                        History
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto max-h-[200px] scrollbar-thin p-0">
                            
                            {activeTab === 'badges' && (
                                <div className="p-4 space-y-3">
                                    {badges.length > 0 ? (
                                        badges.map((badge) => (
                                            <div key={badge.id} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 transition-colors hover:bg-yellow-100/50 dark:hover:bg-yellow-900/30">
                                                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400 shrink-0 shadow-sm">
                                                    <Trophy className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{badge.name}</p>
                                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{badge.unlocked_at}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            <Trophy className="h-10 w-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm font-medium">No badges earned yet.</p>
                                            <p className="text-xs mt-1">Start hiking to unlock them!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div>
                                    {hikeHistory.length > 0 ? (
                                        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                            {hikeHistory.map((hike) => (
                                                <div key={hike.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                            <Mountain className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{hike.mountain_name}</p>
                                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{hike.completed_date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                            Completed
                                                        </span>
                                                        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-500 mt-1">{hike.duration}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            <History className="h-10 w-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm font-medium">No hiking history.</p>
                                            <p className="text-xs mt-1">Your completed hikes will appear here.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>

                <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 md:min-h-min bg-white dark:bg-gray-800 shadow-sm">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-gray-200 dark:stroke-gray-700/50 opacity-50" />
                </div>
            </div>
        </AppLayout>
    );
}