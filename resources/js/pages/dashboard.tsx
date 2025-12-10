import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react'; 
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Activity, MapPin, Mountain, CheckCircle, Trophy, History, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Import komponen Badge UI

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
    
    // State untuk Tab di Kartu ke-3 (Badges vs History)
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            Registration Successful!
                        </DialogTitle>
                        <DialogDescription>
                            Your hike has been registered. Please save your Hike ID below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 my-2">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Your Hike ID</p>
                            <p className="text-3xl font-mono font-bold tracking-widest text-slate-900 dark:text-white select-all">
                                {flash?.new_hike_id}
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button type="button" onClick={() => setShowNewHikeModal(false)}>
                            I Have Saved It
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                
                {/* --- Tombol Register --- */}
                {!currentHike && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-sidebar-border/70 shadow-sm dark:bg-sidebar-accent/10 dark:border-sidebar-border">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Ready for an Adventure?
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Register your hike now to get your unique ID and start tracking.
                            </p>
                        </div>
                        <Button asChild size="lg" className='bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'>
                            <Link href="/register-hike">Register New Hike</Link>
                        </Button>
                    </div>
                )}

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    
                    {/* --- KARTU 1: STATUS --- */}
                    {currentHike ? (
                        <Card className="border-l-4 border-l-orange-500 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                                    Current Status
                                    <Activity className="h-4 w-4 text-orange-500" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {currentHike.status}
                                </div>
                                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                                    <Mountain className="mr-1 h-3 w-3" />
                                    {currentHike.mountain_name}
                                </div>
                                <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/20 rounded-md border border-orange-100 dark:border-orange-900">
                                    <p className="text-[10px] font-semibold text-orange-800 dark:text-orange-400 uppercase">Active ID</p>
                                    <p className="text-lg font-mono font-bold text-orange-900 dark:text-orange-100 leading-none mt-1">
                                        {currentHike.hike_registration_id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-4">
                            <Activity className="h-8 w-8 text-gray-300 mb-2" />
                            <p className="text-sm font-medium text-gray-500">No Active Hike</p>
                            <p className="text-xs text-gray-400">Your status will appear here.</p>
                        </div>
                    )}

                    {/* --- KARTU 2: LOKASI --- */}
                    {currentHike ? (
                        <Card className="border-l-4 border-l-blue-500 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                                    Last Checkpoint
                                    <MapPin className="h-4 w-4 text-blue-500" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {currentHike.last_checkpoint}
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${currentHike.direction === 'Ascent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                                        {currentHike.direction === '-' ? 'Not Started' : currentHike.direction}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-4">
                            <MapPin className="h-8 w-8 text-gray-300 mb-2" />
                            <p className="text-sm font-medium text-gray-500">Location Tracker</p>
                            <p className="text-xs text-gray-400">Scan QR codes to track location.</p>
                        </div>
                    )}

                    {/* --- KARTU 3: ACHIEVEMENTS & HISTORY (TAB) --- */}
                    <Card className="shadow-sm flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Your Journey
                                </CardTitle>
                                {/* Tab Switcher Kecil */}
                                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-0.5">
                                    <button 
                                        onClick={() => setActiveTab('badges')}
                                        className={`px-2 py-0.5 text-xs font-medium rounded-sm transition-all ${activeTab === 'badges' ? 'bg-white shadow text-black dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Badges
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('history')}
                                        className={`px-2 py-0.5 text-xs font-medium rounded-sm transition-all ${activeTab === 'history' ? 'bg-white shadow text-black dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        History
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto max-h-[150px] scrollbar-thin">
                            
                            {/* --- CONTENT: BADGES --- */}
                            {activeTab === 'badges' && (
                                <div className="space-y-3">
                                    {badges.length > 0 ? (
                                        badges.map((badge) => (
                                            <div key={badge.id} className="flex items-center gap-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30">
                                                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400 shrink-0">
                                                    <Trophy className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{badge.name}</p>
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{badge.unlocked_at}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-400 text-xs">
                                            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            No badges earned yet. <br/>Keep hiking!
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- CONTENT: HISTORY --- */}
                            {activeTab === 'history' && (
                                <div className="space-y-2">
                                    {hikeHistory.length > 0 ? (
                                        hikeHistory.map((hike) => (
                                            <div key={hike.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                <div className="flex items-center gap-2">
                                                    <Mountain className="h-3 w-3 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{hike.mountain_name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">{hike.completed_date}</p>
                                                    <p className="text-[10px] text-gray-400">{hike.duration}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-400 text-xs">
                                            <History className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            No hiking history found.
                                        </div>
                                    )}
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}