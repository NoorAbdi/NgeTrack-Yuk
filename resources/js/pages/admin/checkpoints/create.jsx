import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Create({ auth, mountains }) {
    
    // Gunakan useForm hook dari Inertia
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        order: 0,
        mountain_id: mountains[0]?.id || '', // Set default ke gunung pertama
    });

    // Fungsi untuk auto-generate slug dari nama
    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name.toLowerCase()
                         .replace(/[^a-z0-9 -]/g, '') // Hapus karakter non-alfanumerik
                         .replace(/\s+/g, '-') // Ganti spasi dengan -
                         .replace(/-+/g, '-'); // Hapus -- berulang
        setData({
            ...data,
            name: name,
            slug: slug,
        });
    };

    // Fungsi submit form
    const submit = (e) => {
        e.preventDefault();
        post(route('admin.checkpoints.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Checkpoint Baru</h2>}
        >
            <Head title="Tambah Checkpoint" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                
                                <div>
                                    <InputLabel htmlFor="mountain_id" value="Pilih Gunung" />
                                    <select
                                        id="mountain_id"
                                        name="mountain_id"
                                        value={data.mountain_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('mountain_id', e.target.value)}
                                    >
                                        {mountains.map((mountain) => (
                                            <option key={mountain.id} value={mountain.id}>
                                                {mountain.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.mountain_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="name" value="Nama Checkpoint (Contoh: Pos 1: Gerbang Utama)" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={handleNameChange}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="slug" value="Slug (URL)" />
                                    <TextInput
                                        id="slug"
                                        type="text"
                                        name="slug"
                                        value={data.slug}
                                        className="mt-1 block w-full bg-gray-100"
                                        onChange={(e) => setData('slug', e.target.value)}
                                    />
                                    <InputError message={errors.slug} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="order" value="Order (Urutan)" />
                                    <TextInput
                                        id="order"
                                        type="number"
                                        name="order"
                                        value={data.order}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('order', e.target.value)}
                                    />
                                    <InputError message={errors.order} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                                    <Link href={route('admin.checkpoints.index')} className="text-gray-600 hover:text-gray-900">
                                        Batal
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}