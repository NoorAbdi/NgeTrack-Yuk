<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\Hike;
use App\Models\User;

class GamificationService
{
    /**
     * Cek dan berikan badge yang pantas untuk pendaki.
     */
    public function checkAndAwardBadges(Hike $hike)
    {
        $user = $hike->user;

        // 1. Badge "First Step" (Pendakian Pertama)
        // Cek apakah ini satu-satunya pendakian yang statusnya 'completed'
        $completedHikesCount = $user->hikes()->where('status', 'completed')->count();
        if ($completedHikesCount === 1) {
            $this->giveBadge($user, 'First Step');
        }

        // 2. Badge "Papandayan Explorer" (Sesuai Gunung)
        if ($hike->mountain->slug === 'papandayan') {
            $this->giveBadge($user, 'Papandayan Explorer');
        }

        // (Anda bisa tambahkan logika lain di sini, misal cek waktu tempuh untuk 'Speed Runner')
    }

    /**
     * Fungsi bantuan untuk memberikan badge tanpa duplikat.
     */
    private function giveBadge(User $user, string $badgeName)
    {
        $badge = Badge::where('name', $badgeName)->first();

        if ($badge) {
            // syncWithoutDetaching memastikan badge tidak hilang/duplikat
            $user->badges()->syncWithoutDetaching([$badge->id => ['unlocked_at' => now()]]);
        }
    }
}