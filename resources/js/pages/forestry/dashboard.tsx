import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock } from 'lucide-react';
import { useState } from 'react';

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
        emergency_contact: string;
        duration_hours: number;
        safety_status: 'normal' | 'warning' | 'critical';
        planned_descent_date?: string;
    }>;
}

export default function ForestryDashboard({ crowdStats, chartData, todayStats, activeHikersList }: DashboardProps) {
    
    const handleDownloadExcel = () => {
        window.location.href = '/forestry/export/csv';
    };

    const handlePrintReport = () => {
        window.open('/forestry/report/print', '_blank');
    };

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

                    {/* Quick Analysis */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between h-12 gap-1 mt-2">
                                {chartData.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center w-full group relative">
                                        <div 
                                            className="bg-blue-600 w-full rounded-t-sm hover:bg-blue-400 transition-all" 
                                            style={{ height: `${Math.min(data.count * 10, 100)}%` }} 
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
                        <CardTitle>Active Hikers Monitoring (Safety Alert System)</CardTitle>
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
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeHikersList.length > 0 ? (
                                        activeHikersList.map((hike) => (
                                            <tr 
                                                key={hike.id} 
                                                className={`border-b ${hike.safety_status === 'critical' ? 'bg-red-50 dark:bg-red-900/20' : 'dark:border-gray-700'}`}
                                            >
                                                <td className="px-4 py-3 font-medium">{hike.registration_id}</td>
                                                <td className="px-4 py-3">{hike.hiker_name}</td>
                                                <td className="px-4 py-3">{hike.last_position}</td>
                                                <td className="px-4 py-3">{hike.last_update}</td>
                                                <td className="px-4 py-3">
                                                    {/* Indikator Visual Status Safety */}
                                                    {hike.safety_status === 'critical' ? (
                                                        <div className="flex items-center gap-2 text-red-600 font-bold animate-pulse">
                                                            <span>OVERDUE ({hike.duration_hours}h)</span>
                                                        </div>
                                                    ) : hike.safety_status === 'warning' ? (
                                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                            Warning ({hike.duration_hours}h)
                                                        </span>
                                                    ) : (
                                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                            Normal ({hike.duration_hours}h)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Tombol SOS / Kontak */}
                                                        <Button 
                                                            variant={hike.safety_status === 'critical' ? "destructive" : "ghost"} 
                                                            size="sm" 
                                                            onClick={() => alert(`EMERGENCY CONTACT INFO \n\n Hiker: ${hike.hiker_name}\n Phone: ${hike.phone}\n\n Emergency Contact:\n${hike.emergency_contact}`)}
                                                        >
                                                            {hike.safety_status === 'critical' ? 'SOS ALERT' : 'Contact'}
                                                        </Button>

                                                        {/* --- TAMBAHAN: MODAL EXTEND PERMIT --- */}
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                                                    <Clock className="w-4 h-4 mr-1" />
                                                                    Extend
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Extend Permit / Adjust Alert</DialogTitle>
                                                                    <DialogDescription>
                                                                        Update the descent date for <b>{hike.hiker_name}</b> to prevent false safety alerts (e.g., for camping).
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                
                                                                <ExtendPermitForm hike={hike} />
                                                            </DialogContent>
                                                        </Dialog>
                                                        {/* -------------------------------------- */}
                                                    </div>
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

function ExtendPermitForm({ hike }: { hike: any }) {
    const [open, setOpen] = useState(true);
    
    const { data, setData, put, processing, errors } = useForm({
        new_descent_date: hike.planned_descent_date ? hike.planned_descent_date.substring(0, 10) : new Date().toISOString().substring(0, 10),
        admin_notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/forestry/hikes/${hike.id}/extend`, {
            onSuccess: () => {
            }
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4 pt-4">
            <div>
                <Label htmlFor={`new_descent_date_${hike.id}`}>New Descent Date</Label>
                <Input
                    id={`new_descent_date_${hike.id}`}
                    type="datetime-local"
                    className="mt-1"
                    value={data.new_descent_date}
                    onChange={(e) => setData('new_descent_date', e.target.value)}
                    required
                />
                {errors.new_descent_date && <p className="text-red-500 text-xs mt-1">{errors.new_descent_date}</p>}
            </div>

            <div>
                <Label htmlFor={`admin_notes_${hike.id}`}>Reason / Notes</Label>
                <Textarea
                    id={`admin_notes_${hike.id}`}
                    placeholder="e.g. Hiker confirmed camping at Pos 8 for 2 extra days."
                    className="mt-1"
                    value={data.admin_notes}
                    onChange={(e) => setData('admin_notes', e.target.value)}
                    required
                />
                {errors.admin_notes && <p className="text-red-500 text-xs mt-1">{errors.admin_notes}</p>}
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={processing} className="bg-orange-600 hover:bg-orange-700 text-white">
                    {processing ? 'Updating...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}