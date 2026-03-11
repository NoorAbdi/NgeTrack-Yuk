import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { useState, useEffect } from 'react';

export default function ExtendedBooking({ mountains }: { mountains: any[] }) {
    
    const todayDate = new Date().toISOString().substring(0, 10);
    const tomorrowDate = new Date(Date.now() + 86400000).toISOString().substring(0, 10);

    const [ascentDate, setAscentDate] = useState(todayDate);
    const [ascentHour, setAscentHour] = useState("08");
    const [ascentMinute, setAscentMinute] = useState("00");

    const [descentDate, setDescentDate] = useState(tomorrowDate);
    const [descentHour, setDescentHour] = useState("14");
    const [descentMinute, setDescentMinute] = useState("00");

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        mountain_id: mountains.length > 0 ? mountains[0].id : '',
        planned_ascent_date: `${todayDate}T08:00`,
        planned_descent_date: `${tomorrowDate}T14:00`,
        admin_notes: '',
    });

    useEffect(() => {
        setData('planned_ascent_date', `${ascentDate}T${ascentHour}:${ascentMinute}`);
    }, [ascentDate, ascentHour, ascentMinute]);

    useEffect(() => {
        setData('planned_descent_date', `${descentDate}T${descentHour}:${descentMinute}`);
    }, [descentDate, descentHour, descentMinute]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forestry/extended-booking');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Forestry Panel', href: '/forestry/dashboard' },
                { title: 'Special Booking', href: '#' },
            ]}
        >
            <Head title="Special Booking Permit" />

            <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="border-orange-200 dark:border-orange-900/50">
                    <CardHeader className="bg-orange-50/50 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-900/30">
                        <CardTitle className="text-2xl text-orange-800 dark:text-orange-400">
                            Special Extended Permit
                        </CardTitle>
                        <CardDescription>
                            Register climbers who have special permits (Camping, SAR, Research) so that the ALERT system automatically adjusts their time limits.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Hiker's Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email.pendaki@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Hikers must already have an account in the NgeTrack-Yuk application.
                                </p>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Pilih Gunung */}
                            <div className="space-y-2">
                                <Label htmlFor="mountain_id">Mountain Destination</Label>
                                <select
                                    id="mountain_id"
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100"
                                    value={data.mountain_id}
                                    onChange={(e) => setData('mountain_id', Number(e.target.value))}
                                    required
                                >
                                    {mountains.map((mountain) => (
                                        <option key={mountain.id} value={mountain.id}>
                                            {mountain.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.mountain_id} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Ascent Date & Time</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input type="date" className="flex-1 px-2" value={ascentDate} onChange={(e) => setAscentDate(e.target.value)} required />
                                        <select className="h-10 w-16 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" value={ascentHour} onChange={(e) => setAscentHour(e.target.value)}>
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                const hour = i.toString().padStart(2, '0');
                                                return <option key={hour} value={hour}>{hour}</option>;
                                            })}
                                        </select>
                                        <span className="flex items-center text-lg font-bold">:</span>
                                        <select className="h-10 w-16 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" value={ascentMinute} onChange={(e) => setAscentMinute(e.target.value)}>
                                            {['00', '15', '30', '45'].map((minute) => (
                                                <option key={minute} value={minute}>{minute}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <InputError message={errors.planned_ascent_date} className="mt-2" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Descent Date & Time</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input type="date" className="flex-1 px-2" value={descentDate} onChange={(e) => setDescentDate(e.target.value)} required />
                                        <select className="h-10 w-16 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" value={descentHour} onChange={(e) => setDescentHour(e.target.value)}>
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                const hour = i.toString().padStart(2, '0');
                                                return <option key={hour} value={hour}>{hour}</option>;
                                            })}
                                        </select>
                                        <span className="flex items-center text-lg font-bold">:</span>
                                        <select className="h-10 w-16 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" value={descentMinute} onChange={(e) => setDescentMinute(e.target.value)}>
                                            {['00', '15', '30', '45'].map((minute) => (
                                                <option key={minute} value={minute}>{minute}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <InputError message={errors.planned_descent_date} className="mt-2" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin_notes">Permit Reason / Activity Notes</Label>
                                <Textarea
                                    id="admin_notes"
                                    placeholder="Example: Camping permit at Pondok Saladah Post for 3 days 2 nights."
                                    value={data.admin_notes}
                                    onChange={(e) => setData('admin_notes', e.target.value)}
                                    required
                                />
                                <InputError message={errors.admin_notes} className="mt-2" />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-zinc-800">
                                <Link href="/forestry/dashboard">
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="bg-orange-600 hover:bg-orange-700 text-white">
                                    {processing ? 'Processing...' : 'Create Special Permit'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}