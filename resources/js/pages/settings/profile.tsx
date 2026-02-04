import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

// --- DEFINISI TIPE DATA BARU ---
interface UserBadge {
    id: number;
    name: string;
    description: string;
    icon_url: string;
    pivot: {
        unlocked_at: string;
    };
}

interface HikeHistory {
    id: number;
    hike_registration_id: string;
    mountain: {
        name: string;
    };
    status: string;
    completed_at: string | null;
    created_at: string;
}

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
    badges: UserBadge[];
    hikeHistory: HikeHistory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
    badges = [],
    hikeHistory = [],
}: ProfileProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-10"> {/* Tambah jarak antar section */}
                    
                    {/* ================================================== */}
                    {/* BAGIAN 1: GAMIFIKASI (LENCANA)                     */}
                    {/* ================================================== */}
                    <section className='space-y-4'>
                        <HeadingSmall title="My Achievements" description="Badges you have unlocked during your adventures." />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {badges.length > 0 ? (
                                badges.map((badge) => (
                                    <Card key={badge.id} className="border-yellow-400/50 bg-yellow-50 dark:bg-yellow-900/10">
                                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                            <div className="text-3xl">{badge.icon_url}</div>
                                            <div>
                                                <CardTitle className="text-base">{badge.name}</CardTitle>
                                                <p className="text-xs text-muted-foreground">
                                                    Unlocked: {new Date(badge.pivot.unlocked_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                                {badge.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full p-4 text-center border rounded-lg bg-gray-50 border-dashed text-sm text-gray-500">
                                    No badges yet. Start your first hike to earn one!
                                </div>
                            )}
                        </div>
                    </section>

                    <Separator />

                    {/* ================================================== */}
                    {/* BAGIAN 2: RIWAYAT PENDAKIAN                        */}
                    {/* ================================================== */}
                    <section className='space-y-4'>
                        <HeadingSmall title="Hiking History" description="Your journey logbook." />

                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Hike ID</th>
                                        <th className="px-4 py-3">Mountain</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white dark:bg-gray-800'>
                                    {hikeHistory.length > 0 ? (
                                        hikeHistory.map((hike) => (
                                            <tr key={hike.id} className="border-b dark:border-gray-700 hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">{hike.hike_registration_id}</td>
                                                <td className="px-4 py-3">{hike.mountain?.name || 'Unknown'}</td>
                                                <td className="px-4 py-3">{new Date(hike.created_at).toLocaleDateString()}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={hike.status === 'completed' ? 'default' : 'secondary'}>
                                                        {hike.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                                No hiking history found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <Separator />

                    {/* ================================================== */}
                    {/* BAGIAN 3: FORM UPDATE PROFIL (BAWAAN)              */}
                    {/* ================================================== */}
                    <section className='space-y-6'>
                        <HeadingSmall
                            title="Profile information"
                            description="Update your name and email address"
                        />

                        {/* Form Bawaan - Tidak Diubah */}
                        <Form
                            {...ProfileController.update.form()}
                            options={{ preserveScroll: true }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            className="mt-1 block w-full"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Full name"
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Email address"
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the verification email.
                                                </Link>
                                            </p>
                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has been sent.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing}>Save</Button>
                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-neutral-600">Saved</p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </section>

                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}