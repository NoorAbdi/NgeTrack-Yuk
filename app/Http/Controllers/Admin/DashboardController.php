<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hike;
use App\Models\Checkpoint;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. DATA KARTU UTAMA
        $stats = [
            'total_active' => Hike::where('status', 'active')->count(),
            'total_completed' => Hike::where('status', 'completed')->count(),
            'completed_today' => Hike::where('status', 'completed')
                                     ->whereDate('completed_at', today())
                                     ->count(),
        ];

        // 2. DATA CHART: Distribusi Pendaki per Pos
        // Kita ambil semua pendaki aktif, lalu hitung ada berapa orang di setiap pos
        $hikersPerCheckpoint = Hike::where('status', 'active')
            ->with('lastLog.checkpoint')
            ->get()
            ->groupBy(function ($hike) {
                // Jika belum ada log, anggap di Basecamp/Start
                return $hike->lastLog ? $hike->lastLog->checkpoint->name : 'Just Started';
            })
            ->map(function ($group, $key) {
                return [
                    'name' => $key,   
                    'count' => $group->count(), 
                ];
            })
            ->values() // Reset key array agar jadi JSON array murni
            ->toArray();

        // 3. DATA TABEL: Detail Pendaki
        $activeHikesList = Hike::with(['user', 'lastLog.checkpoint'])
            ->where('status', 'active')
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($hike) {
                return [
                    'id' => $hike->id,
                    'hike_id' => $hike->hike_registration_id,
                    'hiker_name' => $hike->user->name,
                    'phone' => $hike->user->phone_number ?? '-',
                    'last_checkpoint' => $hike->lastLog ? $hike->lastLog->checkpoint->name : 'Basecamp',
                    'direction' => $hike->lastLog ? ucfirst($hike->lastLog->direction) : '-',
                    'duration' => $hike->created_at->diffForHumans(null, true) . ' on trail',
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'chartData' => $hikersPerCheckpoint,
            'activeHikes' => $activeHikesList,
        ]);
    }
}