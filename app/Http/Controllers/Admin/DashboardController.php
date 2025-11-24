<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hike;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'active_hikers' => Hike::where('status', 'active')->count(),
            'pending_hikers' => Hike::where('status', 'pending')->count(),
            'completed_today' => Hike::where('status', 'completed')
                                     ->whereDate('completed_at', today())
                                     ->count(),
        ];

        // Ambil Data Pendaki yang Sedang Aktif (Real-time Monitoring)
        $activeHikes = Hike::with([
                'user',           
                'mountain',       
                'lastLog.checkpoint'
            ])
            ->where('status', 'active')
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($hike) {
                return [
                    'id' => $hike->id,
                    'hiker_name' => $hike->user->name,
                    'hike_id' => $hike->hike_registration_id,
                    'phone' => $hike->user->phone_number ?? '-',
                    'emergency_contact' => $hike->user->emergency_contact_phone ?? '-',
                    'mountain' => $hike->mountain->name,
                    'last_position' => $hike->lastLog ? $hike->lastLog->checkpoint->name : 'Belum Scan (Basecamp)',
                    'direction' => $hike->lastLog ? ucfirst($hike->lastLog->direction) : '-',
                    'last_seen' => $hike->lastLog ? $hike->lastLog->scanned_at->diffForHumans() : '-',
                    'start_date' => $hike->planned_ascent_date,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'activeHikes' => $activeHikes,
        ]);
    }
}