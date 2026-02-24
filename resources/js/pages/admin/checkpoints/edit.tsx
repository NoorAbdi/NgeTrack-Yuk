import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Mountain {
    id: number;
    name: string;
}

interface Checkpoint {
    id: number;
    mountain_id: number;
    name: string;
    slug: string;
    order: number;
}

interface EditProps {
    checkpoint: Checkpoint;
    mountains: Mountain[];
}

export default function Edit({ checkpoint, mountains }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        mountain_id: checkpoint.mountain_id || '',
        name: checkpoint.name || '',
        slug: checkpoint.slug || '',
        order: checkpoint.order || 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/checkpoints/${checkpoint.id}`);
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Manage Checkpoints', href: '/admin/checkpoints' },
                { title: 'Edit Checkpoint', href: '#' },
            ]}
        >
            <Head title={`Edit Checkpoint - ${checkpoint.name}`} />

            <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit Checkpoint
                        </CardTitle>
                        <CardDescription>
                            Update the details for checkpoint #{checkpoint.order} - {checkpoint.name}.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* --- PILIH GUNUNG --- */}
                            <div className="space-y-2">
                                <Label htmlFor="mountain_id" className="text-gray-700 dark:text-gray-300">
                                    Mountain Location
                                </Label>
                                <select
                                    id="mountain_id"
                                    value={data.mountain_id}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100"
                                    onChange={(e) => setData('mountain_id', Number(e.target.value))}
                                    required
                                >
                                    <option value="" disabled>Select a mountain</option>
                                    {mountains.map((mountain) => (
                                        <option key={mountain.id} value={mountain.id}>
                                            {mountain.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.mountain_id} className="mt-2" />
                            </div>

                            {/* --- NAMA CHECKPOINT --- */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                                    Checkpoint Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="e.g. Pos 1 - Pondok Salada"
                                    className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData('name', e.target.value);
                                        // Opsional: Auto-generate slug sederhana saat mengetik nama
                                        if (!data.slug || data.slug === checkpoint.slug) {
                                            const generatedSlug = e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9]+/g, '-')
                                                .replace(/(^-|-$)+/g, '');
                                            setData((prev) => ({ ...prev, name: e.target.value, slug: generatedSlug }));
                                        }
                                    }}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* --- SLUG (URL & QR IDENTIFIER) --- */}
                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300">
                                        Slug (QR Identifier)
                                    </Label>
                                    <Input
                                        id="slug"
                                        type="text"
                                        placeholder="e.g. papandayan-pos-1"
                                        className="bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Must be unique. Used for QR code scanning URL.
                                    </p>
                                    <InputError message={errors.slug} className="mt-2" />
                                </div>

                                {/* --- ORDER CHECKPOINT --- */}
                                <div className="space-y-2">
                                    <Label htmlFor="order" className="text-gray-700 dark:text-gray-300">
                                        Order Sequence
                                    </Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="0"
                                        className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
                                        value={data.order}
                                        onChange={(e) => setData('order', parseInt(e.target.value))}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        0 = Basecamp, 1 = Pos 1, etc.
                                    </p>
                                    <InputError message={errors.order} className="mt-2" />
                                </div>
                            </div>

                            {/* --- TOMBOL AKSI --- */}
                            <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-zinc-800 mt-6">
                                <Link href="/admin/checkpoints">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}