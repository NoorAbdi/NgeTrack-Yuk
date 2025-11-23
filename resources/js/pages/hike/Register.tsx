import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormEventHandler } from 'react';
import { BreadcrumbItem } from '@/types';

interface Mountain {
    id: number;
    name: string;
    difficulty_level: string;
}

interface AuthProps {
    user: {
        name: string;
        email: string;
        phone_number?: string;
    };
}

export default function Register({ mountains }: { mountains: Mountain[] }) {
    const { auth } = usePage().props as unknown as { auth: AuthProps };
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        mountain_id: mountains.length > 0 ? mountains[0].id : '',
        planned_ascent_date: '',
        planned_descent_date: '',
        terms_accepted: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register-hike');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Register Hike',
            href: '/register-hike',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register Hike" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-sidebar-border/70">
                        
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Register New Hike</h2>
                            <p className="text-sm text-gray-500">Please fill in the details below to get your registration ID.</p>
                        </div>

                        <div className="mb-6 p-4 bg-gray-50 rounded-md border">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Hiker Details</h3>
                            <div className="text-sm text-gray-600 grid grid-cols-1 gap-1">
                                <p><span className="font-semibold">Name:</span> {user.name}</p>
                                <p><span className="font-semibold">Email:</span> {user.email}</p>
                                <p><span className="font-semibold">Phone:</span> {user.phone_number || '(Not set)'}</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Pilih Gunung */}
                            <div className="space-y-2">
                                <Label htmlFor="mountain_id">Select Mountain</Label>
                                <select
                                    id="mountain_id"
                                    name="mountain_id"
                                    value={data.mountain_id}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    onChange={(e) => setData('mountain_id', Number(e.target.value))}
                                    required
                                >
                                    {mountains.map((mountain) => (
                                        <option key={mountain.id} value={mountain.id}>
                                            {mountain.name} ({mountain.difficulty_level})
                                        </option>
                                    ))}
                                </select>
                                {errors.mountain_id && <p className="text-red-500 text-xs">{errors.mountain_id}</p>}
                            </div>

                            {/* Tanggal Naik */}
                            <div className="space-y-2">
                                <Label htmlFor="planned_ascent_date">Planned Ascent Date</Label>
                                <Input
                                    id="planned_ascent_date"
                                    type="date"
                                    value={data.planned_ascent_date}
                                    onChange={(e) => setData('planned_ascent_date', e.target.value)}
                                    required
                                />
                                {errors.planned_ascent_date && <p className="text-red-500 text-xs">{errors.planned_ascent_date}</p>}
                            </div>

                            {/* Tanggal Turun */}
                            <div className="space-y-2">
                                <Label htmlFor="planned_descent_date">Planned Descent Date</Label>
                                <Input
                                    id="planned_descent_date"
                                    type="date"
                                    value={data.planned_descent_date}
                                    onChange={(e) => setData('planned_descent_date', e.target.value)}
                                    required
                                />
                                {errors.planned_descent_date && <p className="text-red-500 text-xs">{errors.planned_descent_date}</p>}
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.terms_accepted}
                                    onChange={(e) => setData('terms_accepted', e.target.checked)}
                                    required
                                />
                                <Label htmlFor="terms" className="font-normal text-gray-600">
                                    I agree to follow all safety guidelines and park regulations.
                                </Label>
                            </div>
                            {errors.terms_accepted && <p className="text-red-500 text-xs">{errors.terms_accepted}</p>}

                            <div className="flex items-center justify-end pt-4">
                                <Button type="submit" disabled={processing}>
                                    Register Hike
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}