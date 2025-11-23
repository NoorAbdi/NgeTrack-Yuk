import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, checkpoints, flash }) {

    const { delete: destroy } = useForm();

    const deleteCheckpoint = (checkpoint) => {
        if (confirm('Apakah Anda yakin ingin menghapus checkpoint ini?')) {
            destroy(route('admin.checkpoints.destroy', checkpoint.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Checkpoints</h2>}
        >
            <Head title="Kelola Checkpoints" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {flash.success && (
                                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                    {flash.success}
                                </div>
                            )}

                            <div className="mb-4">
                                <Link href={route('admin.checkpoints.create')}>
                                    <PrimaryButton>Tambah Checkpoint Baru</PrimaryButton>
                                </Link>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gunung</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Checkpoint</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {checkpoints.map((checkpoint) => (
                                        <tr key={checkpoint.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{checkpoint.mountain.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{checkpoint.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{checkpoint.slug}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{checkpoint.order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route('admin.checkpoints.edit', checkpoint.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteCheckpoint(checkpoint)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}