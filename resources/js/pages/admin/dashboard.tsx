import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    Clock, 
    CheckCircle, 
    RefreshCw, 
    MapPin, 
    Navigation 
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface HikeData {
    id: number;
    hiker_name: string;
    hike_id: string;
    phone: string;
    mountain: string;
    last_position: string;
    direction: string;
    last_seen: string;
}

interface DashboardProps {
    stats: {
        active_hikers: number;
        pending_hikers: number;
        completed_today: number;
    };
    activeHikes: HikeData[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
];

export default function AdminDashboard({ stats, activeHikes }: DashboardProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            handleRefresh();
        }, 30000); // 30000ms = 30 seconds

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['stats', 'activeHikes'],
            onFinish: () => {
                setIsRefreshing(false);
                setLastUpdated(new Date());
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Monitoring" />

            <div className="p-4 sm:p-6 space-y-6 bg-muted/10 min-h-screen">
                
                {/* --- HEADER MONITORING --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Live Monitoring
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Real-time tracking of hiker activities and safety status.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground bg-white dark:bg-sidebar p-2 rounded-lg border shadow-sm">
                        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleRefresh} 
                            className={isRefreshing ? 'animate-spin' : ''}
                            title="Refresh Data Now"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* --- 2. KARTU STATISTIK DENGAN IKON --- */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-l-4 border-l-green-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Hikers</CardTitle>
                            <Users className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.active_hikers}
                            </div>
                            <p className="text-xs text-muted-foreground">Currently on trails</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.pending_hikers}
                            </div>
                            <p className="text-xs text-muted-foreground">Registered, not started</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.completed_today}
                            </div>
                            <p className="text-xs text-muted-foreground">Returned safely</p>
                        </CardContent>
                    </Card>
                </div>

                {/* --- 3. TABEL MONITORING LEBIH RAPI --- */}
                <Card className="shadow-md border-sidebar-border/70">
                    <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-indigo-500" />
                            <CardTitle className="text-lg">Active Hikers Location</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs font-semibold uppercase text-muted-foreground bg-gray-50 dark:bg-gray-900/50 border-b">
                                    <tr>
                                        <th className="px-6 py-4">Hike ID / Name</th>
                                        <th className="px-6 py-4">Last Checkpoint</th>
                                        <th className="px-6 py-4 text-center">Direction</th>
                                        <th className="px-6 py-4">Last Seen</th>
                                        <th className="px-6 py-4">Contact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {activeHikes.length > 0 ? (
                                        activeHikes.map((hike) => (
                                            <tr key={hike.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50/80 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{hike.hike_id}</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">{hike.hiker_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-3 w-3 text-gray-400" />
                                                        <span className="text-gray-700 dark:text-gray-300">{hike.last_position}</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground ml-5">{hike.mountain}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={`
                                                            ${hike.direction === 'Ascent' 
                                                                ? 'bg-orange-50 text-orange-700 border-orange-200' 
                                                                : 'bg-green-50 text-green-700 border-green-200'
                                                            } gap-1 px-3 py-1
                                                        `}
                                                    >
                                                        <Navigation className={`h-3 w-3 ${hike.direction === 'Ascent' ? '-rotate-45' : 'rotate-135'}`} />
                                                        {hike.direction}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400">
                                                    {hike.last_seen}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {hike.phone}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Users className="h-8 w-8 text-gray-300" />
                                                    <p>No hikers are currently on the trails.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}