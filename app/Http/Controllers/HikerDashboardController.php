<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Hike;
use Illuminate\Support\Facades\Auth;

class HikerDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Ambil Pendakian Aktif (Sama seperti sebelumnya)
        $currentHike = Hike::with(['mountain', 'lastLog.checkpoint'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'active'])
            ->latest()
            ->first();

        $hikeData = null;
        if ($currentHike) {
            $lastCheckpointName = 'Basecamp (Not Scanned Yet)';
            if ($currentHike->lastLog && $currentHike->lastLog->checkpoint) {
                $lastCheckpointName = $currentHike->lastLog->checkpoint->name;
            }

            $hikeData = [
                'hike_registration_id' => $currentHike->hike_registration_id,
                'mountain_name' => $currentHike->mountain->name,
                'status' => ucfirst($currentHike->status),
                'last_checkpoint' => $lastCheckpointName,
                'direction' => $currentHike->lastLog ? ucfirst($currentHike->lastLog->direction) : '-',
                'started_at' => $currentHike->created_at->format('d M Y'),
            ];
        }

        // 2. DATA BARU: Ambil Badges User
        $badges = $user->badges()->orderBy('pivot_unlocked_at', 'desc')->get()->map(function ($badge) {
            return [
                'id' => $badge->id,
                'name' => $badge->name,
                'description' => $badge->description,
                'icon' => $badge->icon, // 'trophy', 'mountain', dll
                'unlocked_at' => \Carbon\Carbon::parse($badge->pivot->unlocked_at)->diffForHumans(),
            ];
        });

        // 3. DATA BARU: Riwayat Pendakian Selesai
        $history = Hike::with('mountain')
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->orderByDesc('completed_at')
            ->limit(5) // Ambil 5 terakhir saja
            ->get()
            ->map(function ($hike) {
                return [
                    'id' => $hike->id,
                    'mountain_name' => $hike->mountain->name,
                    'completed_date' => \Carbon\Carbon::parse($hike->completed_at)->format('d M Y'),
                    'duration' => $hike->created_at->diffForHumans($hike->completed_at, true),
                ];
            });

        return Inertia::render('Dashboard', [
            'currentHike' => $hikeData,
            'badges' => $badges,
            'hikeHistory' => $history,
        ]);
    }
}