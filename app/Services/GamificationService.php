<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\Hike;

class GamificationService
{
    /**
     * Cek dan berikan badge jika user memenuhi syarat.
     */
    public function checkAndAwardBadges(Hike $hike)
    {
        $user = $hike->user;

        // --- ATURAN 1: BADGE "FIRST HIKE" ---
        // Diberikan jika ini adalah pendakian sukses pertama user.
        $completedCount = Hike::where('user_id', $user->id)
                              ->where('status', 'completed')
                              ->count();

        if ($completedCount === 1) { // Baru saja selesai 1
            $this->giveBadge($user, 'first-hike');
        }

        // --- ATURAN 2: BADGE SPESIFIK GUNUNG ---
        // Misal: Jika selesai mendaki Papandayan
        if ($hike->mountain->slug === 'papandayan') {
            $this->giveBadge($user, 'papandayan-explorer');
        }
    }

    /**
     * Helper untuk memberikan badge ke user (tanpa duplikat).
     */
    private function giveBadge($user, $badgeSlug)
    {
        $badge = Badge::where('slug', $badgeSlug)->first();

        // Jika badge ada di DB dan user BELUM memilikinya
        if ($badge && !$user->badges->contains($badge->id)) {
            $user->badges()->attach($badge->id, ['unlocked_at' => now()]);
        }
    }
}