<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('badges')->delete();

        Badge::create([
            'name' => 'First Step',
            'description' => 'Awarded for completing your very first hike.',
            'icon_url' => '🎯',
        ]);

        Badge::create([
            'name' => 'Papandayan Explorer',
            'description' => 'Successfully conquered Mount Papandayan.',
            'icon_url' => '🏔️',
        ]);

        Badge::create([
            'name' => 'Speed Runner',
            'description' => 'Completed a hike in record time!',
            'icon_url' => '⚡',
        ]);
    }
}