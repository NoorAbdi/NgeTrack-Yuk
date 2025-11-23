<?php

namespace App\Http\Controllers;

use App\Models\Hike;
use App\Models\Mountain;
use App\Services\HikeRegistrationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class HikeRegistrationController extends Controller
{
    protected $registrationService;

    public function __construct(HikeRegistrationService $registrationService)
    {
        $this->registrationService = $registrationService;
    }

    /**
     * Menampilkan formulir pendaftaran pendakian.
     */
    public function create()
    {
        // Ambil data gunung yang statusnya 'open' saja
        $mountains = Mountain::where('status', 'open')->get();

        return Inertia::render('Hike/Register', [
            'mountains' => $mountains,
            // Kirim data user untuk auto-fill form (opsional, karena Inertia sudah punya auth.user)
        ]);
    }

    /**
     * Memproses data pendaftaran.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mountain_id' => 'required|exists:mountains,id',
            'planned_ascent_date' => 'required|date|after_or_equal:today',
            'planned_descent_date' => 'required|date|after_or_equal:planned_ascent_date',
            'terms_accepted' => 'required|accepted',
        ]);

        $registrationId = $this->registrationService->generateUniqueId();

        $hike = Hike::create([
            'user_id' => Auth::id(),
            'mountain_id' => $validated['mountain_id'],
            'hike_registration_id' => $registrationId,
            'status' => 'pending',
            'planned_ascent_date' => $validated['planned_ascent_date'],
            'planned_descent_date' => $validated['planned_descent_date'],
            'terms_accepted_at' => now(),
        ]);

        return Redirect::route('dashboard')->with('success', 'Registration Successful! Your Hike ID is: ' . $registrationId);
    }
}