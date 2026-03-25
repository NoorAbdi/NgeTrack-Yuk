import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react'; 
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Activity, MapPin, Mountain, CheckCircle, Trophy, History, Camera, X } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';

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

    const [scannedCheckpoint, setScannedCheckpoint] = useState<any | null>(null);
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    useEffect(() => {
        if (flash?.new_hike_id) {
            setShowNewHikeModal(true);
        }
    }, [flash]);

    const handleScanSuccess = async (scannedText: string) => {
        if (scannedText && !scannedCheckpoint) {
            try {
                const url = new URL(scannedText);
                const slug = url.pathname.split('/').pop();

                const response = await axios.get(`/checkpoint/${slug}`, {
                    headers: { Accept: 'application/json' }
                });

                setScannedCheckpoint(response.data.checkpoint);
            } catch (error) {
                console.error("Invalid QR or Checkpoint not found", error);
            }
        }
    };

    const submitCheckIn = () => {
        setIsCheckingIn(true);
        router.post('/checkpoint/scan', { checkpoint_id: scannedCheckpoint.id }, {
            preserveState: true,
            onSuccess: () => {
                setScannedCheckpoint(null); 
                setIsCheckingIn(false);
            },
            onError: () => setIsCheckingIn(false)
        });
    };

    const simulateScan = () => {
        setScannedCheckpoint({
            id: 1,
            name: "Pos 1 - Main Gate",
            subtitle: "Registration & Briefing Area"
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

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
                
                {!currentHike && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Ready for an Adventure?
                            </h3>
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
                    
                    {currentHike ? (
                        <Card className="border-l-4 border-l-orange-500 shadow-sm bg-white dark:bg-gray-800 border-y-gray-200 border-r-gray-200 dark:border-y-gray-700 dark:border-r-gray-700">
                            <CardHeader className="pb-2">
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

                    <Card className="shadow-sm flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                    Your Journey
                                </CardTitle>
                                <div className="flex bg-gray-100 dark:bg-gray-900/50 rounded-lg p-1">
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

                <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 md:min-h-min bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center justify-center p-6">
                    
                    {!currentHike && (
                        <div className="absolute inset-0 size-full flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 z-10">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-gray-200 dark:stroke-gray-700/50 opacity-50 -z-10" />
                            <Camera className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Scanner Unavailable</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Please register a hike to activate the QR Scanner.</p>
                        </div>
                    )}

                    {currentHike && !scannedCheckpoint && (
                        <div className="w-full max-w-md flex flex-col items-center z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Camera className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Checkpoint Scanner</h3>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">
                                Scan QR if you reach checkpoints to update your location.
                            </p>
                            
                            <div className="w-full aspect-square md:aspect-video bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative cursor-pointer" onClick={simulateScan}>

                            <div className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-inner">
                                <Scanner 
                                    onScan={(result) => {
                                        if (result && result.length > 0) {
                                            handleScanSuccess(result[0].rawValue);
                                        }
                                    }}
                                    onError={(error: any) => console.log(error?.message || error)}
                                />
                            </div>
                                <div className="absolute inset-0 border-2 border-blue-500/50 m-8 rounded-lg animate-pulse pointer-events-none" />
                                <span className="text-gray-500 dark:text-gray-500 font-medium">Click to Simulate Scan (Dev)</span>
                            </div>
                        </div>
                    )}

                    {currentHike && scannedCheckpoint && (
                        <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-2xl z-20 animate-in slide-in-from-bottom-4 duration-300">
                            
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                    {scannedCheckpoint.name}
                                </h2>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                                    Confirm your location update
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button 
                                    variant="outline"
                                    onClick={() => setScannedCheckpoint(null)}
                                    disabled={isCheckingIn}
                                    className="flex-1 py-6 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={submitCheckIn}
                                    disabled={isCheckingIn}
                                    className="flex-1 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    {isCheckingIn ? 'Updating...' : 'Check In Now'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}