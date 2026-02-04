<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Badge;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        Badge::create([
            'name' => 'First Step',
            'slug' => 'first-hike',
            'description' => 'Awarded for completing your very first hike.',
            'icon' => 'footprints', 
        ]);

        Badge::create([
            'name' => 'Papandayan Explorer',
            'slug' => 'papandayan-explorer',
            'description' => 'Awarded for conquering Mount Papandayan.',
            'icon' => 'mountain',
        ]);
    }
}