import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table'; 
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode as QrIcon, Printer, Trash2, Edit } from 'lucide-react';
import { useRef } from 'react';

export default function Index({ auth, checkpoints, flash }) {

    const { delete: destroy } = useForm();

    const deleteCheckpoint = (checkpoint) => {
        if (confirm('Are you sure you want to delete this checkpoint?')) {
            destroy(route('admin.checkpoints.destroy', checkpoint.id), {
                preserveScroll: true,
            });
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById("qr-print-area");
        const win = window.open('', '', 'height=700,width=700');
        win.document.write('<html><head><title>Print QR Code</title>');
        win.document.write('</head><body >');
        win.document.write(printContent.innerHTML);
        win.document.write('</body></html>');
        win.document.close();
        win.print();
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Kelola Checkpoints', href: '/admin/checkpoints' },
            ]}
        >
            <Head title="Kelola Checkpoints" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Checkpoint List</h2>
                        <Link href={route('admin.checkpoints.create')}>
                            <Button>+ Add Checkpoint</Button>
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border">
                        <div className="p-6 text-gray-900">

                            {flash?.success && (
                                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                    {flash.success}
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Order</th>
                                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Checkpoint Name</th>
                                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Location (Mountain)</th>
                                            <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase">QR Code</th>
                                            <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {checkpoints.map((checkpoint) => {
                                            // Generate URL lengkap untuk checkpoint ini
                                            // Contoh: http://localhost:8000/checkpoint/papandayan-pos-1
                                            const qrUrl = `${window.location.origin}/checkpoint/${checkpoint.slug}`;

                                            return (
                                                <tr key={checkpoint.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono">
                                                        #{checkpoint.order}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                        {checkpoint.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                        {checkpoint.mountain?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        
                                                        {/* --- MODAL QR CODE --- */}
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="gap-2">
                                                                    <QrIcon className="h-4 w-4" /> Show QR
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-md">
                                                                <DialogHeader>
                                                                    <DialogTitle>QR Code: {checkpoint.name}</DialogTitle>
                                                                    <DialogDescription>
                                                                        Scan this code to check-in at the location..
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                
                                                                <div className="flex flex-col items-center justify-center p-6 space-y-4" id="qr-print-area">
                                                                    <div className="border-4 border-black p-4 bg-white rounded-xl">
                                                                        <QRCode 
                                                                            value={qrUrl} 
                                                                            size={256}
                                                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                                            viewBox={`0 0 256 256`}
                                                                        />
                                                                    </div>
                                                                    <p className="text-sm text-center font-mono text-gray-500 break-all">
                                                                        {qrUrl}
                                                                    </p>
                                                                    <div className="text-center font-bold text-lg mt-2">
                                                                        {checkpoint.name}
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-end sm:justify-center">
                                                                    {/* Tombol ini hanya memicu print browser (Ctrl+P) secara manual untuk saat ini */}
                                                                    <Button type="button" onClick={() => window.print()}>
                                                                        <Printer className="mr-2 h-4 w-4" /> Print QR
                                                                    </Button>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                        {/* --------------------- */}

                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                        <Link href={route('admin.checkpoints.edit', checkpoint.id)}>
                                                            <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-900">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <button onClick={() => deleteCheckpoint(checkpoint)}>
                                                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-900">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}