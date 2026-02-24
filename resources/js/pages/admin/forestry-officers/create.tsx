import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone_number: '', password: '', password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/forestry-officers');
    };

    return (
        <AuthenticatedLayout breadcrumbs={[
            { title: 'Officers', href: '/admin/forestry-officers' },
            { title: 'Add Officer', href: '#' }
        ]}>
            <Head title="Add Forestry Officer" />
            <div className="py-12 max-w-2xl mx-auto px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Register New Forestry Officer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                <InputError message={errors.email} />
                            </div>
                            <div>
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input id="phone_number" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} />
                                <InputError message={errors.phone_number} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                    <InputError message={errors.password} />
                                </div>
                                <div>
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Link href="/admin/forestry-officers">
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>Save Account</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}