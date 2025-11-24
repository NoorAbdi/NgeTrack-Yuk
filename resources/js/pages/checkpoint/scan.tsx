import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormEventHandler } from 'react';
import { BreadcrumbItem } from '@/types';
import { QrCode } from 'lucide-react';

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
        { title: 'Scan Checkpoint', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Scan: ${checkpoint.name}`} />

            {/* Container utama dibuat flex agar konten berada di tengah layar HP */}
            <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 bg-background">
                
                <div className="w-full max-w-sm space-y-8 text-center">
                    
                    {/* Header: Nama Pos & Ikon */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <QrCode className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {checkpoint.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Welcome, Hiker! Please check in below.
                            </p>
                        </div>
                    </div>

                    {/* Form Input */}
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="space-y-2">
                            <Label htmlFor="hike_id" className="sr-only">
                                Hike Registration ID
                            </Label>
                            
                            {/* Input dioptimalkan untuk mobile:
                                1. text-center & tracking-widest: Agar mudah dibaca
                                2. text-lg & py-6: Ukuran font & padding lebih besar untuk jari
                                3. autoCapitalize: Agar keyboard otomatis huruf besar
                                4. inputMode: Mengoptimalkan keyboard virtual
                            */}
                            <Input
                                id="hike_id"
                                name="hike_id"
                                type="text"
                                required
                                autoCapitalize="characters"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                className="text-center text-2xl font-mono tracking-[0.2em] uppercase h-14 border-2 focus-visible:ring-offset-2"
                                placeholder="H-2025..."
                                value={data.hike_registration_id}
                                onChange={(e) => setData('hike_registration_id', e.target.value.toUpperCase())}
                            />
                            
                            {errors.hike_registration_id && (
                                <p className="text-sm font-medium text-destructive animate-pulse">
                                    {errors.hike_registration_id}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            size="lg"
                            className="w-full text-base font-semibold h-12 shadow-md transition-all active:scale-95"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Logging...
                                </span>
                            ) : (
                                'Confirm Check-In'
                            )}
                        </Button>
                    </form>

                    {/* Footer Bantuan Kecil */}
                    <p className="text-xs text-muted-foreground">
                        Having trouble? Contact the basecamp officer.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}