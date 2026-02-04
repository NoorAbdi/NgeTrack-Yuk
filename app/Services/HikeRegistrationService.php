<?php

namespace App\Services;

use App\Models\Hike;
use Carbon\Carbon;

class HikeRegistrationService
{
    /**
     * Generate Unique Hiking ID Registration.
     * Format: H-YYYYMMDD-NNN (Example: H-20251124-001)
     */
    public function generateUniqueId(): string
    {
        $today = Carbon::now();
        $datePrefix = $today->format('Ymd'); // 20251124
        $prefix = 'H-' . $datePrefix . '-';  // H-20251124-

        $countToday = Hike::where('hike_registration_id', 'like', $prefix . '%')->count();
        
        $nextNumber = $countToday + 1;
        
        $paddedNumber = str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        return $prefix . $paddedNumber;
    }
}