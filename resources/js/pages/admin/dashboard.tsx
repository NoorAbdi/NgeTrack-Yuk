import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Flag, Trophy } from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

// Definisi Tipe Data Props
interface DashboardProps {
    stats: {
        total_active: number;
        total_completed: number;
        completed_today: number;
    };
    chartData: Array<{ name: string; count: number }>;
    activeHikes: Array<{
        id: number;
        hike_id: string;
        hiker_name: string;
        phone: string;
        last_checkpoint: string;
        direction: string;
        duration: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
];

export default function AdminDashboard({ stats, chartData, activeHikes }: DashboardProps) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Monitoring Center" />

            <div className="p-6 space-y-8">
                
                {/* 1. HEADER RINGKASAN (Summary Cards) */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Hikers On Trail</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_active}</div>
                            <p className="text-xs text-muted-foreground">People are hiking now</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                            <Trophy className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completed_today}</div>
                            <p className="text-xs text-muted-foreground">Hikers descended safely today</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-gray-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Completed (All Time)</CardTitle>
                            <Flag className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_completed}</div>
                            <p className="text-xs text-muted-foreground">Total successful ascents recorded</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. VISUALISASI DATA (Chart) */}
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                    
                    {/* Bar Chart: Distribusi Pendaki */}
                    <Card className="col-span-7">
                        <CardHeader>
                            <CardTitle>Hiker Distribution per Checkpoint</CardTitle>
                            <CardDescription>
                                Visualization of the number of hikers detected at each current post.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#888888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                // Memotong nama pos yang kepanjangan jika perlu
                                                tickFormatter={(value) => value.split(':')[0]} 
                                            />
                                            <YAxis 
                                                stroke="#888888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                allowDecimals={false}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} barSize={50}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f97316' : '#ea580c'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                        No active data to display yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. TABEL DETAIL (Real-time List) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Live Monitoring Details</CardTitle>
                        <CardDescription>Complete list of who is where.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Hike ID</th>
                                        <th className="px-4 py-3">Hiker Name</th>
                                        <th className="px-4 py-3">Current Location</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Duration</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Contact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {activeHikes.length > 0 ? (
                                        activeHikes.map((hike) => (
                                            <tr key={hike.id} className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800">
                                                <td className="px-4 py-3 font-mono font-medium text-orange-600">
                                                    {hike.hike_id}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                    {hike.hiker_name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                        {hike.last_checkpoint}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        hike.direction === 'Ascent' 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {hike.direction === 'Ascent' ? '⬆️ Climbing' : '⬇️ Descending'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {hike.duration}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {hike.phone}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                There are no active hikers at this time.
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