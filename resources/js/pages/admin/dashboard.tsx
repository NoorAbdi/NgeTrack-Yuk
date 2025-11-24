import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Definisi Tipe Data
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Monitoring" />

            <div className="p-6 space-y-6">
                
                {/* 1. Kartu Statistik */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Hikers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.active_hikers}</div>
                            <p className="text-xs text-muted-foreground">Currently on the mountain</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Registrations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.pending_hikers}</div>
                            <p className="text-xs text-muted-foreground">Registered but not started</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.completed_today}</div>
                            <p className="text-xs text-muted-foreground">Safely returned</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. Tabel Monitoring Real-time */}
                <Card className="col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Live Monitoring (Active Hikers)</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                                Refresh Data
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Hike ID</th>
                                        <th className="px-4 py-3">Hiker Name</th>
                                        <th className="px-4 py-3">Last Checkpoint</th>
                                        <th className="px-4 py-3">Direction</th>
                                        <th className="px-4 py-3">Last Seen</th>
                                        <th className="px-4 py-3">Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeHikes.length > 0 ? (
                                        activeHikes.map((hike) => (
                                            <tr key={hike.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">{hike.hike_id}</td>
                                                <td className="px-4 py-3">{hike.hiker_name}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                        {hike.last_position}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`font-bold ${hike.direction === 'Ascent' ? 'text-orange-500' : 'text-green-500'}`}>
                                                        {hike.direction}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{hike.last_seen}</td>
                                                <td className="px-4 py-3">{hike.phone}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                No active hikers at the moment.
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