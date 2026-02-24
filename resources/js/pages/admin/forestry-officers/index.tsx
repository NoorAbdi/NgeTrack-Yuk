import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function Index({ officers, flash }: any) {
    const { delete: destroy } = useForm();

    const deleteOfficer = (id: number) => {
        if (confirm('Are you sure you want to delete this officer account?')) {
            destroy(`/admin/forestry-officers/${id}`);
        }
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'Manage Officers', href: '/admin/forestry-officers' }]}>
            <Head title="Manage Forestry Officers" />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Forestry Officers</h2>
                    <Link href="/admin/forestry-officers/create">
                        <Button>+ Add Officer</Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-zinc-800">
                    <div className="p-6">
                        {flash?.success && (
                            <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded">{flash.success}</div>
                        )}

                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-sm">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Phone</th>
                                    <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {officers.map((officer: any) => (
                                    <tr key={officer.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{officer.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{officer.email}</td>
                                        <td className="px-6 py-4 text-gray-500">{officer.phone_number || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteOfficer(officer.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}