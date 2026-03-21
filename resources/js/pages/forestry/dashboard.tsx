import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

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
        evacuation_status: string | null;
        planned_descent_date?: string; 
    }>;
}

export default function ForestryDashboard({ crowdStats, chartData, todayStats, activeHikersList }: DashboardProps) {
    
    const [currentTime, setCurrentTime] = useState(new Date());
    const [reportDate, setReportDate] = useState(new Date().toISOString().substring(0, 10));

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleDownloadExcel = () => {
        window.location.href = '/forestry/export/csv';
    };

    const handlePrintReport = () => {
        window.open(`/forestry/report?date=${reportDate}`, '_blank');
    };

    const getCrowdColor = (status: string) => {
        if (status === 'Critical') return 'bg-red-500 hover:bg-red-600';
        if (status === 'Warning') return 'bg-yellow-500 hover:bg-yellow-600';
        return 'bg-green-500 hover:bg-green-600';
    };

    const handleEvacuation = (id: number, status: 'searching' | 'rescued') => {
        const message = status === 'searching' 
            ? "WARNING: Are you sure you want to declare this hiker as MISSING and initiate a SAR operation?"
            : "SUCCESS: Confirm that this hiker has been RESCUED?";
            
        if (confirm(message)) {
            router.put(`/forestry/hikes/${id}/evacuation`, { status });
        }
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

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black">
                                    Export PDF Report
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Download Daily Report</DialogTitle>
                                    <DialogDescription>
                                        Select a specific date to generate the historical activity report.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Label htmlFor="report_date" className="font-semibold">Report Date</Label>
                                    <Input 
                                        id="report_date"
                                        type="date" 
                                        value={reportDate} 
                                        onChange={(e) => setReportDate(e.target.value)} 
                                        className="mt-2"
                                    />
                                </div>
                                <DialogFooter className="sm:justify-end">
                                    <Button 
                                        onClick={handlePrintReport} 
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        Generate PDF
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Bagian 2: Statistik Utama (Top Cards) */}
                <div className="grid gap-4 md:grid-cols-3">
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
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                                <div className={`h-2.5 rounded-full ${getCrowdColor(crowdStats.status)}`} style={{ width: `${crowdStats.percentage}%` }}></div>
                            </div>
                        </CardContent>
                    </Card>

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

                {/* Bagian 3: Tabel & Panel Waktu */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    
                    {/* TABEL HIKER */}
                    <Card className="lg:col-span-3">
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
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {hike.safety_status === 'critical' ? (
                                                            <div className="inline-flex items-center gap-2 text-red-600 font-bold animate-pulse">
                                                                <span>OVERDUE ({Math.floor(hike.duration_hours)}h)</span>
                                                            </div>
                                                        ) : hike.safety_status === 'warning' ? (
                                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap inline-block">
                                                                Warning ({Math.floor(hike.duration_hours)}h)
                                                            </span>
                                                        ) : (
                                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap inline-block">
                                                                Normal ({Math.floor(hike.duration_hours)}h)
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-2 items-center">

                                                            {hike.evacuation_status === 'searching' && (
                                                                <Button 
                                                                    variant="default" 
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                    size="sm" 
                                                                    onClick={() => handleEvacuation(hike.id, 'rescued')}
                                                                >
                                                                    Mark as Rescued
                                                                </Button>
                                                            )}

                                                            {hike.safety_status === 'critical' && hike.evacuation_status !== 'searching' && (
                                                                <Button 
                                                                    variant="destructive" 
                                                                    size="sm" 
                                                                    onClick={() => handleEvacuation(hike.id, 'searching')}
                                                                >
                                                                    Declare Missing
                                                                </Button>
                                                            )}

                                                            <Button 
                                                                variant={hike.safety_status === 'critical' ? "destructive" : "ghost"} 
                                                                size="sm" 
                                                                onClick={() => alert(`EMERGENCY CONTACT INFO \n\n Hiker: ${hike.hiker_name}\n Phone: ${hike.phone}\n\n Emergency Contact:\n${hike.emergency_contact}`)}
                                                            >
                                                                {hike.safety_status === 'critical' ? 'SOS ALERT' : 'Contact'}
                                                            </Button>

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

                    {/* PANEL WAKTU & KALENDER */}
                    <div className="flex flex-col gap-4">
                        
                        {/* Jam Digital Real-time */}
                        <Card className="border-orange-500/40 border-2 overflow-hidden relative bg-white dark:bg-zinc-950 shadow-sm">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                <Clock className="w-8 h-8 text-orange-500 mb-3" />
                                <div className="text-4xl lg:text-3xl xl:text-4xl font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 tabular-nums">
                                    {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                                </div>
                                <div className="text-sm mt-2 text-gray-500 dark:text-zinc-400 font-medium">
                                    {currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Kalender Visual */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-orange-500" /> 
                                    Calendar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center pb-6">
                                <Calendar
                                    mode="single"
                                    selected={currentTime}
                                    className="rounded-md border shadow bg-white dark:bg-zinc-950/50"
                                />
                            </CardContent>
                        </Card>
                        
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

function ExtendPermitForm({ hike }: { hike: any }) {
    
    const initialDate = hike.planned_descent_date ? hike.planned_descent_date.substring(0, 10) : new Date().toISOString().substring(0, 10);
    const initialHour = hike.planned_descent_date ? hike.planned_descent_date.substring(11, 13) : "12";
    const initialMinute = hike.planned_descent_date ? hike.planned_descent_date.substring(14, 16) : "00";

    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [selectedHour, setSelectedHour] = useState(initialHour);
    const [selectedMinute, setSelectedMinute] = useState(initialMinute);

    const { data, setData, put, processing, errors } = useForm({
        new_descent_date: `${initialDate}T${initialHour}:${initialMinute}`,
        admin_notes: '',
    });

    useEffect(() => {
        setData('new_descent_date', `${selectedDate}T${selectedHour}:${selectedMinute}`);
    }, [selectedDate, selectedHour, selectedMinute]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/forestry/hikes/${hike.id}/extend`);
    };

    return (
        <form onSubmit={submit} className="space-y-4 pt-4">
            <div>
                <Label>New Descent Date & Time (24h Format)</Label>
                <div className="flex gap-2 mt-1">
                    <Input
                        type="date"
                        className="flex-1"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                    />
                    
                    <select
                        className="flex h-10 w-20 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                    >
                        {Array.from({ length: 24 }).map((_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return <option key={hour} value={hour}>{hour}</option>;
                        })}
                    </select>

                    <span className="flex items-center text-lg font-bold">:</span>

                    <select
                        className="flex h-10 w-20 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                    >
                        {['00', '15', '30', '45'].map((minute) => (
                            <option key={minute} value={minute}>{minute}</option>
                        ))}
                    </select>
                </div>
                {errors.new_descent_date && <p className="text-red-500 text-xs mt-1">{errors.new_descent_date}</p>}
            </div>

            <div>
                <Label htmlFor={`admin_notes_${hike.id}`}>Reason / Notes</Label>
                <Textarea
                    id={`admin_notes_${hike.id}`}
                    placeholder="e.g. Hiker confirmed camping at Pos 3 for 2 extra days."
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