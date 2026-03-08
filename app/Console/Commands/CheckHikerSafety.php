<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Hike;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckHikerSafety extends Command
{
    protected $signature = 'hiker:check-safety';
    protected $description = 'Check active hikers status and send Telegram alert if CRITICAL';

    public function handle()
    {
        $this->info('Checking hiker safety status...');

        $activeHikes = Hike::where('status', 'active')->with(['user', 'lastLog.checkpoint'])->get();

        foreach ($activeHikes as $hike) {
            $now = Carbon::now();
            
            $descentDeadline = Carbon::parse($hike->planned_descent_date);
            
            $isCritical = $now->greaterThan($descentDeadline);

            if ($isCritical) {
                $lastSent = $hike->last_alert_sent_at ? Carbon::parse($hike->last_alert_sent_at) : null;
                
                if (!$lastSent || $now->diffInHours($lastSent) >= 1) {
                    $this->sendTelegramAlert($hike);
                }
            }
        }

        $this->info('Check complete.');
    }

    private function sendTelegramAlert($hike)
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_CHAT_ID');

        if (!$token || !$chatId) {
            $this->error('Telegram config missing!');
            return;
        }

        $overdueDuration = Carbon::parse($hike->planned_descent_date)->diffForHumans();
        $lastLocation = $hike->lastLog ? $hike->lastLog->checkpoint->name : 'Basecamp (Not scanned yet)';
        $phone = $hike->user->phone_number ?? '-';
        $contactName = $hike->user->emergency_contact_name ?? '-';
        $contactPhone = $hike->user->emergency_contact_phone ?? '-';

        $message = "🚨 <b>SOS ALERT: CRITICAL HIKER</b> 🚨\n\n" .
                   "👤 <b>Name:</b> {$hike->user->name}\n" .
                   "🆔 <b>Reg ID:</b> {$hike->hike_registration_id}\n" .
                   "📍 <b>Last Location:</b> {$lastLocation}\n" .
                   "⏳ <b>Status:</b> OVERDUE (Should go down at {$overdueDuration})\n\n" .
                   "📞 <b>Hiker Phone:</b> {$phone}\n" .
                   "🚑 <b>Emergency Contact:</b> {$contactName} ({$contactPhone})\n\n" .
                   "⚠️ <i>Immediately carry out checks or SAR action!</i>";

        try {
            $response = Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML',
            ]);

            if ($response->successful()) {
                $hike->update(['last_alert_sent_at' => now()]);
                $this->info("Alert sent for: {$hike->user->name}");
            } else {
                Log::error('Telegram API Error: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('Failed to send Telegram alert: ' . $e->getMessage());
        }
    }
}