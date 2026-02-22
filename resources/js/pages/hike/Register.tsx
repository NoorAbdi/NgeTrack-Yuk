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
        member_emails: [] as string[], // Tambahan state array untuk email anggota
    });

    // --- LOGIKA GROUP HIKING ---
    const MAX_MEMBERS = 9;

    const addMember = () => {
        if (data.member_emails.length < MAX_MEMBERS) {
            setData('member_emails', [...data.member_emails, '']);
        }
    };

    const removeMember = (indexToRemove: number) => {
        const updatedEmails = data.member_emails.filter((_, index) => index !== indexToRemove);
        setData('member_emails', updatedEmails);
    };

    const updateMemberEmail = (index: number, value: string) => {
        const updatedEmails = [...data.member_emails];
        updatedEmails[index] = value;
        setData('member_emails', updatedEmails);
    };
    // ---------------------------

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

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* PERBAIKAN WARNA DI SINI:
                        - bg-white: Memastikan latar belakang putih (atau sesuai tema di mode gelap)
                        - text-gray-900: Memastikan teks utama berwarna gelap
                        - dark:bg-zinc-900 & dark:text-gray-100: Dukungan mode gelap
                    */}
                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-lg p-8 border border-gray-200 dark:border-zinc-800">
                        
                        <div className="mb-8 border-b border-gray-200 dark:border-zinc-800 pb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Start Your Adventure</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Fill in the details below to generate your unique Hike ID.
                            </p>
                        </div>

                        {/* Info Pendaki */}
                        <div className="mb-8 bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-gray-100 dark:border-zinc-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Hiker Information (Leader)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{user.name}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{user.email}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{user.phone_number || '(Not set)'}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Pilih Gunung */}
                            <div className="space-y-2">
                                <Label htmlFor="mountain_id" className="text-gray-700 dark:text-gray-300">Select Mountain</Label>
                                <select
                                    id="mountain_id"
                                    name="mountain_id"
                                    value={data.mountain_id}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:focus:ring-indigo-600"
                                    onChange={(e) => setData('mountain_id', Number(e.target.value))}
                                    required
                                >
                                    {mountains.map((mountain) => (
                                        <option key={mountain.id} value={mountain.id}>
                                            {mountain.name} ({mountain.difficulty_level})
                                        </option>
                                    ))}
                                </select>
                                {errors.mountain_id && <p className="text-red-600 text-xs font-medium">{errors.mountain_id}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Tanggal Naik */}
                                <div className="space-y-2">
                                    <Label htmlFor="planned_ascent_date" className="text-gray-700 dark:text-gray-300">Ascent Date</Label>
                                    <Input
                                        id="planned_ascent_date"
                                        type="date"
                                        className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
                                        value={data.planned_ascent_date}
                                        onChange={(e) => setData('planned_ascent_date', e.target.value)}
                                        required
                                    />
                                    {errors.planned_ascent_date && <p className="text-red-600 text-xs font-medium">{errors.planned_ascent_date}</p>}
                                </div>

                                {/* Tanggal Turun */}
                                <div className="space-y-2">
                                    <Label htmlFor="planned_descent_date" className="text-gray-700 dark:text-gray-300">Descent Date</Label>
                                    <Input
                                        id="planned_descent_date"
                                        type="date"
                                        className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
                                        value={data.planned_descent_date}
                                        onChange={(e) => setData('planned_descent_date', e.target.value)}
                                        required
                                    />
                                    {errors.planned_descent_date && <p className="text-red-600 text-xs font-medium">{errors.planned_descent_date}</p>}
                                </div>
                            </div>

                            {/* --- INFORMASI GRUP (GROUP HIKING) --- */}
                            <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 space-y-4 mt-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Group Members (Optional)</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Hiking with friends? Add their registered emails below. They will automatically join your group and appear on their dashboard. Max 10 people total.
                                    </p>
                                </div>

                                {/* Render Input Dinamis berdasarkan array member_emails */}
                                {data.member_emails.map((email, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <div className="flex-1 w-full">
                                            <Label className="sr-only">Member Email {index + 1}</Label>
                                            <Input
                                                type="email"
                                                placeholder={`Member ${index + 1} Email (e.g. friend@example.com)`}
                                                className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
                                                value={email}
                                                onChange={(e) => updateMemberEmail(index, e.target.value)}
                                                required
                                            />
                                            {/* Error validation dari backend Laravel */}
                                            {errors[`member_emails.${index}` as keyof typeof errors] && (
                                                <p className="mt-1 text-red-600 text-xs font-medium">
                                                    {errors[`member_emails.${index}` as keyof typeof errors]}
                                                </p>
                                            )}
                                        </div>
                                        <Button 
                                            type="button" 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => removeMember(index)}
                                            className="w-full sm:w-auto mt-2 sm:mt-0 h-10"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}

                                {/* Tombol Tambah Anggota */}
                                {data.member_emails.length < MAX_MEMBERS && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={addMember}
                                        className="w-full border-dashed border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 h-10"
                                    >
                                        + Add Group Member ({data.member_emails.length}/9)
                                    </Button>
                                )}
                            </div>

                            {/* Terms & Conditions */}
                            <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-zinc-900"
                                        checked={data.terms_accepted}
                                        onChange={(e) => setData('terms_accepted', e.target.checked)}
                                        required
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
                                            I agree to the Safety Guidelines
                                        </Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            I confirm that I am physically fit and will follow all park regulations.
                                        </p>
                                    </div>
                                </div>
                                {errors.terms_accepted && <p className="mt-2 text-red-600 text-xs font-medium">{errors.terms_accepted}</p>}
                            </div>

                            <div className="pt-6">
                                <Button type="submit" disabled={processing} className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 h-11 text-base">
                                    {processing ? 'Processing...' : 'Register Hike'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}