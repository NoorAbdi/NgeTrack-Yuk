<?php

namespace App\Http\Controllers;

use App\Models\Hike;
use App\Models\Mountain;
use App\Models\User;
use App\Services\HikeRegistrationService;
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
                
                $now = Carbon::now();
                $durationHours = $hike->created_at->diffInHours($now);
                $descentDeadline = Carbon::parse($hike->planned_descent_date);
                $safetyStatus = 'normal';
                
                if ($now->greaterThan($descentDeadline)) {
                    $safetyStatus = 'critical'; 
                } 
                elseif ($now->greaterThan($descentDeadline->copy()->subHours(3))) {
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
                    'evacuation_status' => $hike->evacuation_status,
                ];
            });

        return Inertia::render('forestry/dashboard', [
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
            'missing_hikers' => Hike::where('evacuation_status', 'searching')->count(),
            'rescued_hikers' => Hike::where('evacuation_status', 'rescued')->count(),
            'recent_hikes' => Hike::with(['user', 'lastLog.checkpoint'])
                                ->orderBy('created_at', 'desc')
                                ->limit(50) 
                                ->get()
        ];

        return view('forestry.report_print', $data);
    }

    public function extendPermit(Request $request, Hike $hike)
    {
        $validated = $request->validate([
            'new_descent_date' => 'required|date|after_or_equal:today',
            'admin_notes' => 'required|string|max:500', 
        ]);

        $existingNotes = $hike->admin_notes ? $hike->admin_notes . "\n" : "";
        $newNote = $existingNotes . "[" . now()->format('Y-m-d H:i') . "] Time extended by " . auth()->user()->name . ". Reason: " . $validated['admin_notes'];

        $hike->update([
            'planned_descent_date' => $validated['new_descent_date'],
            'admin_notes' => $newNote,
        ]);

        return redirect()->back()->with('success', 'Permit extended! The Alert limit for this hiker has been adjusted.');
    }

    public function updateEvacuation(Request $request, Hike $hike)
    {
        $validated = $request->validate([
            'status' => 'required|in:searching,rescued',
        ]);

        $note = "[" . now()->format('Y-m-d H:i') . "] EVACUATION STATUS: " . strtoupper($validated['status']) . " by " . auth()->user()->name;

        if ($validated['status'] === 'rescued') {
            $hike->update([
                'evacuation_status' => 'rescued',
                'status' => 'completed',
                'completed_at' => now(),
                'admin_notes' => $hike->admin_notes ? $hike->admin_notes . "\n" . $note : $note,
            ]);
            return redirect()->back()->with('success', 'Hiker marked as RESCUED and hike completed.');
        } else {
            $hike->update([
                'evacuation_status' => 'searching',
                'admin_notes' => $hike->admin_notes ? $hike->admin_notes . "\n" . $note : $note,
            ]);
            return redirect()->back()->with('success', 'SAR Operation Initiated. Hiker marked as MISSING.');
        }
    }

    public function createBooking()
    {
        $mountains = Mountain::where('status', 'open')->get();
        return Inertia::render('forestry/ExtendedBooking', [
            'mountains' => $mountains
        ]);
    }

    public function storeBooking(Request $request, HikeRegistrationService $registrationService)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'mountain_id' => 'required|exists:mountains,id',
            'planned_ascent_date' => 'required|date|after_or_equal:today',
            'planned_descent_date' => 'required|date|after_or_equal:planned_ascent_date',
            'admin_notes' => 'required|string|max:500',
        ], [
            'email.exists' => 'The hiker email address was not found in the system. Please ensure the hiker has registered with the application first.',
        ]);

        $user = User::where('email', $validated['email'])->first();
        
        $registrationId = $registrationService->generateUniqueId();

        Hike::create([
            'user_id' => $user->id,
            'mountain_id' => $validated['mountain_id'],
            'hike_registration_id' => $registrationId,
            'status' => 'pending', 
            'planned_ascent_date' => $validated['planned_ascent_date'],
            'planned_descent_date' => $validated['planned_descent_date'],
            'terms_accepted_at' => now(), 
            'admin_notes' => "[SPECIAL PERMIT by " . auth()->user()->name . "] " . $validated['admin_notes'],
        ]);

        return redirect()->route('forestry.dashboard')->with('success', 'Extended Permit successfully created for ' . $user->name . '.');
    }
}