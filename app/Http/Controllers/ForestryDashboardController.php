<?php

namespace App\Http\Controllers;

use App\Models\Hike;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Response;

class ForestryDashboardController extends Controller
{
    public function index()
    {
        $activeHikersCount = Hike::where('status', 'active')->count();
        $maxCapacity = 100; 
        $crowdPercentage = ($activeHikersCount / $maxCapacity) * 100;

        $hikesLast7Days = Hike::selectRaw('DATE(created_at) as date, count(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(6))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        $todayStats = [
            'registered' => Hike::whereDate('created_at', Carbon::today())->count(),
            'checked_in' => Hike::whereDate('created_at', Carbon::today())->where('status', 'active')->count(),
            'completed' => Hike::whereDate('completed_at', Carbon::today())->where('status', 'completed')->count(),
        ];

        $activeHikers = Hike::with(['user', 'lastLog.checkpoint'])
            ->where('status', 'active')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($hike) {
                
                $durationHours = $hike->created_at->diffInHours(Carbon::now());
                
                $safetyStatus = 'normal';
                if ($durationHours > 10) {
                    $safetyStatus = 'critical'; 
                } elseif ($durationHours > 5) {
                    $safetyStatus = 'warning';
                }

                return [
                    'id' => $hike->id,
                    'hiker_name' => $hike->user->name,
                    'registration_id' => $hike->hike_registration_id,
                    'last_position' => $hike->lastLog ? $hike->lastLog->checkpoint->name : 'Basecamp',
                    'last_update' => $hike->lastLog ? $hike->lastLog->scanned_at->diffForHumans() : '-',
                    'phone' => $hike->user->phone_number ?? '-',
                    'emergency_contact' => $hike->user->emergency_contact_name 
                        ? $hike->user->emergency_contact_name . ' (' . ($hike->user->emergency_contact_phone ?? '-') . ')' 
                        : 'Not Set',
                    'duration_hours' => $durationHours,
                    'safety_status' => $safetyStatus, 
                ];
            });

        return Inertia::render('Forestry/Dashboard', [
            'crowdStats' => [
                'active' => $activeHikersCount,
                'capacity' => $maxCapacity,
                'percentage' => round($crowdPercentage),
                'status' => $crowdPercentage > 80 ? 'Critical' : ($crowdPercentage > 50 ? 'Warning' : 'Safe'),
            ],
            'chartData' => $hikesLast7Days,
            'todayStats' => $todayStats,
            'activeHikersList' => $activeHikers,
        ]);
    }

    public function downloadCsv()
    {
        $filename = "hiker-report-" . date('Y-m-d') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $hikes = Hike::with(['user', 'mountain'])->orderBy('created_at', 'desc')->get();

        $callback = function() use ($hikes) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, ['Registration ID', 'Hiker Name', 'Email', 'Phone', 'Emergency Contact', 'Mountain', 'Date', 'Status', 'Completed At']);

            foreach ($hikes as $hike) {
                $emergency = $hike->user->emergency_contact_name 
                    ? $hike->user->emergency_contact_name . ' (' . $hike->user->emergency_contact_phone . ')'
                    : '-';

                fputcsv($file, [
                    $hike->hike_registration_id,
                    $hike->user->name,
                    $hike->user->email,
                    $hike->user->phone_number,
                    $emergency,
                    $hike->mountain->name ?? 'N/A',
                    $hike->created_at->format('Y-m-d H:i'),
                    $hike->status,
                    $hike->completed_at,
                ]);
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    public function printReport()
    {
        $data = [
            'date' => Carbon::now()->format('d F Y'),
            'total_hikers' => Hike::count(),
            'active_hikers' => Hike::where('status', 'active')->count(),
            'completed_hikers' => Hike::where('status', 'completed')->count(),
            'recent_hikes' => Hike::with(['user', 'lastLog.checkpoint'])
                                ->orderBy('created_at', 'desc')
                                ->limit(50) 
                                ->get()
        ];

        return view('forestry.report_print', $data);
    }
}