<?php

namespace App\Http\Controllers;

use App\Models\Hike;
use App\Models\Mountain;
use App\Models\User;
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

    public function create()
    {
        $mountains = Mountain::where('status', 'open')->get();

        return Inertia::render('hike/Register', [
            'mountains' => $mountains,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mountain_id' => 'required|exists:mountains,id',
            'planned_ascent_date' => 'required|date|after_or_equal:today',
            'planned_descent_date' => 'required|date|after_or_equal:planned_ascent_date',
            'terms_accepted' => 'required|accepted',
            'member_emails' => 'nullable|array|max:9',
            'member_emails.*' => [
                'required',
                'email',
                'exists:users,email',
                'not_in:' . Auth::user()->email
            ],
        ], [
            'member_emails.*.exists' => 'Email: input not found. Make sure your friend is registered in the system.',
            'member_emails.*.not_in' => 'You are the leader, no need to enter your own email.',
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

        if (!empty($validated['member_emails'])) {
            $memberIds = User::whereIn('email', $validated['member_emails'])->pluck('id');
            
            if ($memberIds->isNotEmpty()) {
                $hike->members()->attach($memberIds);
            }
        }

        return Redirect::route('dashboard')->with([
            'success' => 'Registration Successful!',
            'new_hike_id' => $registrationId, 
        ]);
    }
}