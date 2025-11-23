import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormEventHandler } from 'react';
import { BreadcrumbItem } from '@/types';

interface Checkpoint {
    id: number;
    name: string;
    slug: string;
}

export default function Scan({ checkpoint }: { checkpoint: Checkpoint }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        hike_registration_id: '',
        checkpoint_id: checkpoint.id,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/checkpoint/scan', {
            onSuccess: () => reset('hike_registration_id'),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Checkpoint Scan', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Scan: ${checkpoint.name}`} />

            <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900">
                <div className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700">
                    
                    <div className="text-center">
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                            {checkpoint.name}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Please enter your Hike ID to check-in.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={submit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="mb-4">
                                <Label htmlFor="hike_id" className="sr-only">
                                    Hike Registration ID
                                </Label>
                                <Input
                                    id="hike_id"
                                    name="hike_id"
                                    type="text"
                                    required
                                    className="text-center text-lg tracking-widest uppercase"
                                    placeholder="H-2025XXXX-XXX"
                                    value={data.hike_registration_id}
                                    onChange={(e) => setData('hike_registration_id', e.target.value.toUpperCase())}
                                />
                                {errors.hike_registration_id && (
                                    <p className="text-red-500 text-xs mt-1 text-center">{errors.hike_registration_id}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {processing ? 'Processing...' : 'Check In Now'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}