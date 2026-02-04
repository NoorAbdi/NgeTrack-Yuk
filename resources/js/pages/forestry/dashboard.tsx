import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Definisikan tipe data props jika menggunakan TypeScript (Opsional, tapi disarankan)
interface DashboardProps {
    crowdStats: {
        status: string;
        active: number;
        capacity: number;
        percentage: number;
    };
    chartData: Array<{ count: number }>;
    todayStats: {
        registered: number;
        checked_in: number;
        completed: number;
    };
    activeHikersList: Array<{
        id: number;
        registration_id: string;
        hiker_name: string;
        last_position: string;
        last_update: string;
        phone: string;
    }>;
}

export default function ForestryDashboard({ crowdStats, chartData, todayStats, activeHikersList }: DashboardProps) {
    
    // 1. Fungsi untuk Export Excel (CSV)
    const handleDownloadExcel = () => {
        // Mengarahkan browser ke route download CSV
        window.location.href = '/forestry/export/csv';
    };

    // 2. Fungsi untuk Export PDF (Print View)
    const handlePrintReport = () => {
        // Membuka halaman laporan di tab baru agar dashboard tidak tertutup
        window.open('/forestry/report/print', '_blank');
    };

    // Helper function untuk warna status crowd
    const getCrowdColor = (status: string) => {
        if (status === 'Critical') return 'bg-red-500 hover:bg-red-600';
        if (status === 'Warning') return 'bg-yellow-500 hover:bg-yellow-600';
        return 'bg-green-500 hover:bg-green-600';
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Forestry Panel', href: '/forestry/dashboard' },
                { title: 'Monitoring Dashboard', href: '#' },
            ]}
        >
            <Head title="Forestry Monitoring" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                
                {/* Bagian 1: Header & Export Actions */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Eco-Tourism Monitoring</h2>
                        <p className="text-muted-foreground text-sm">
                            Real-time data analysis & crowd control for Mount Papandayan.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {/* UPDATE: Tombol sekarang memiliki fungsi onClick */}
                        <Button variant="outline" size="sm" onClick={handleDownloadExcel}>
                            Download Excel
                        </Button>
                        <Button variant="default" size="sm" onClick={handlePrintReport}>
                            Export PDF Report
                        </Button>
                    </div>
                </div>

                {/* Bagian 2: Statistik Utama (Top Cards) */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Crowd Monitor Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Real-time Crowd</CardTitle>
                            <Badge className={getCrowdColor(crowdStats.status)}>{crowdStats.status}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{crowdStats.active} / {crowdStats.capacity} Hikers</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {crowdStats.percentage}% of maximum trail capacity.
                            </p>
                            {/* Simple Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                                <div className={`h-2.5 rounded-full ${getCrowdColor(crowdStats.status)}`} style={{ width: `${crowdStats.percentage}%` }}></div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Stats */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Daily Traffic</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{todayStats.registered} Registrations</div>
                            <p className="text-xs text-muted-foreground">
                                {todayStats.checked_in} currently on track, {todayStats.completed} finished safely.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Quick Analysis (Placeholder Grafik Sederhana) */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Visualisasi Bar Chart Sederhana menggunakan CSS Flex */}
                            <div className="flex items-end justify-between h-12 gap-1 mt-2">
                                {chartData.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center w-full group relative">
                                        <div 
                                            className="bg-blue-600 w-full rounded-t-sm hover:bg-blue-400 transition-all" 
                                            style={{ height: `${Math.min(data.count * 10, 100)}%` }} // Asumsi skala sederhana
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 text-center">Last 7 Days Activity</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bagian 3: Tabel Monitoring Aktif (Khusus Safety) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Active Hikers Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Reg ID</th>
                                        <th className="px-4 py-3">Hiker Name</th>
                                        <th className="px-4 py-3">Last Checkpoint</th>
                                        <th className="px-4 py-3">Last Update</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeHikersList.length > 0 ? (
                                        activeHikersList.map((hike) => (
                                            <tr key={hike.id} className="border-b dark:border-gray-700">
                                                <td className="px-4 py-3 font-medium">{hike.registration_id}</td>
                                                <td className="px-4 py-3">{hike.hiker_name}</td>
                                                <td className="px-4 py-3">{hike.last_position}</td>
                                                <td className="px-4 py-3">{hike.last_update}</td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {/* Tombol SOS menggunakan data Phone */}
                                                    <Button variant="ghost" size="sm" onClick={() => alert(`Call Emergency: ${hike.phone}`)}>
                                                        SOS Contact
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4 text-gray-500">No hikers currently on the trail.</td>
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