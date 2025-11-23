<?php

namespace App\Http\Controllers;

use App\Models\Checkpoint;
use App\Models\CheckpointLog;
use App\Models\Hike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CheckpointController extends Controller
{
    /**
     * Menampilkan halaman scan saat QR Code dipindai.
     * URL: /checkpoint/{slug}
     */
    public function show($slug)
    {
        $checkpoint = Checkpoint::where('slug', $slug)->firstOrFail();

        return Inertia::render('checkpoint/scan', [
            'checkpoint' => $checkpoint,
        ]);
    }

    /**
     * Memproses data scan dan mencatat log.
     */
    public function store(Request $request)
    {
        $request->validate([
            'hike_registration_id' => 'required|exists:hikes,hike_registration_id',
            'checkpoint_id' => 'required|exists:checkpoints,id',
        ]);

        $hike = Hike::where('hike_registration_id', $request->hike_registration_id)
                    ->whereIn('status', ['active', 'pending'])
                    ->first();

        if (!$hike) {
            return back()->withErrors(['hike_registration_id' => 'Hike registration not found or already completed.']);
        }

        $currentCheckpoint = Checkpoint::findOrFail($request->checkpoint_id);

        $direction = 'ascent';
    
        $lastLog = $hike->logs()->latest('scanned_at')->first();

        if ($lastLog) {
            $lastCheckpoint = $lastLog->checkpoint;
            
            if ($currentCheckpoint->order <= $lastCheckpoint->order) {
                $direction = 'descent';
            }
        }

        CheckpointLog::create([
            'hike_id' => $hike->id,
            'checkpoint_id' => $currentCheckpoint->id,
            'direction' => $direction,
            'scanned_at' => now(),
        ]);

        if ($hike->status === 'pending') {
            $hike->update(['status' => 'active']);
        }

        if ($currentCheckpoint->order === 0 && $direction === 'descent') {
            $hike->update([
                'status' => 'completed',
                'completed_at' => now()
            ]);
            return Redirect::route('home')->with('success', 'Hiking completed! Welcome back.');
        }

        return back()->with('success', "Check-in successful at {$currentCheckpoint->name} ({$direction})!");
    }
}