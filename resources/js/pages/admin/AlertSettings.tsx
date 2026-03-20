import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AlertSettingsProps {
    setting: {
        warning_threshold_hours: number;
        critical_threshold_hours: number;
    };
}

export default function AlertSettings({ setting }: AlertSettingsProps) {
    const { data, setData, put, processing, errors } = useForm({
        warning_threshold_hours: setting.warning_threshold_hours,
        critical_threshold_hours: setting.critical_threshold_hours,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/alert-settings');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin Panel', href: '/admin/dashboard' },
                { title: 'Manage Alert System', href: '#' },
            ]}
        >
            <Head title="Manage Alert System" />

            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        Alert Logic Configuration
                    </h2>
                    <p className="text-muted-foreground">Configure the automated safety rules for the monitoring dashboard.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>System Thresholds</CardTitle>
                        <CardDescription>
                            Determine when the system should automatically change a hiker's safety status.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={submit} className="space-y-8">
                            
                            {/* Konfigurasi WARNING */}
                            <div className="flex gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50">
                                <div className="mt-1"><AlertTriangle className="w-6 h-6 text-yellow-600" /></div>
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="warning_threshold_hours" className="text-yellow-800 dark:text-yellow-500 font-bold text-base">
                                        Warning Status (Yellow)
                                    </Label>
                                    <p className="text-sm text-yellow-700/80 dark:text-yellow-600">
                                        Trigger the Warning alert <b>X hours</b> before the hiker's planned descent deadline.
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Input
                                            id="warning_threshold_hours"
                                            type="number"
                                            min="1"
                                            className="w-24 bg-white dark:bg-zinc-950"
                                            value={data.warning_threshold_hours}
                                            onChange={(e) => setData('warning_threshold_hours', Number(e.target.value))}
                                        />
                                        <span className="text-sm font-medium">Hours before deadline</span>
                                    </div>
                                    {errors.warning_threshold_hours && <p className="text-red-500 text-xs">{errors.warning_threshold_hours}</p>}
                                </div>
                            </div>

                            {/* Konfigurasi CRITICAL */}
                            <div className="flex gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50">
                                <div className="mt-1"><ShieldAlert className="w-6 h-6 text-red-600" /></div>
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="critical_threshold_hours" className="text-red-800 dark:text-red-500 font-bold text-base">
                                        Critical Status (Red / SOS)
                                    </Label>
                                    <p className="text-sm text-red-700/80 dark:text-red-600">
                                        Trigger the Critical alert <b>X hours</b> after the hiker's planned descent deadline has passed. <i>(0 means exactly at deadline)</i>.
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Input
                                            id="critical_threshold_hours"
                                            type="number"
                                            min="0"
                                            className="w-24 bg-white dark:bg-zinc-950"
                                            value={data.critical_threshold_hours}
                                            onChange={(e) => setData('critical_threshold_hours', Number(e.target.value))}
                                        />
                                        <span className="text-sm font-medium">Hours after deadline</span>
                                    </div>
                                    {errors.critical_threshold_hours && <p className="text-red-500 text-xs">{errors.critical_threshold_hours}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t dark:border-zinc-800">
                                <Button type="submit" disabled={processing} className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black">
                                    {processing ? 'Saving...' : 'Save Configuration'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}