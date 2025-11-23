<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mountain;
use App\Models\Checkpoint;
use Illuminate\Support\Facades\DB;

class CheckpointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('checkpoints')->delete();

        $papandayan = Mountain::where('slug', 'papandayan')->first();

        if ($papandayan) {
            
            $checkpoints = [
                // --- Linear Path ---
                ['name' => 'Pos 1: Main Gate', 'slug' => 'papandayan-pos-1-main-gate', 'order' => 0],
                ['name' => 'Pos 2: Parking Area', 'slug' => 'papandayan-pos-2-parking', 'order' => 1],
                ['name' => 'Pos 3: Security Post (Reporting)', 'slug' => 'papandayan-pos-3-security', 'order' => 2],
                ['name' => 'Pos 4: Trailhead Entrance', 'slug' => 'papandayan-pos-4-trailhead', 'order' => 3],
                ['name' => 'Pos 5: Asphalt Road End', 'slug' => 'papandayan-pos-5-asphalt-end', 'order' => 4],
                ['name' => 'Pos 6: Crater Area', 'slug' => 'papandayan-pos-6-crater', 'order' => 5],
                
                // --- Branching Point ---
                ['name' => 'Pos 7: Junction (Dead Forest/Ghober Hoet)', 'slug' => 'papandayan-pos-7-junction', 'order' => 6],
                
                // --- Parallel Paths (Both order 7) ---
                ['name' => 'Pos 8: Ghober Hoet (Route A)', 'slug' => 'papandayan-pos-8-ghober-hoet', 'order' => 7],
                ['name' => 'Pos 9: Dead Forest (Route B)', 'slug' => 'papandayan-pos-9-dead-forest', 'order' => 7],
                
                // --- Meeting Point (Higher order) ---
                ['name' => 'Pos 10: Pondok Saladah Camp', 'slug' => 'papandayan-pos-10-pondok-saladah', 'order' => 8],
            ];

            foreach ($checkpoints as $cp) {
                Checkpoint::create([
                    'mountain_id' => $papandayan->id,
                    'name' => $cp['name'],
                    'slug' => $cp['slug'],
                    'order' => $cp['order']
                ]);
            }

        } else {
            $this->command->warn('Mountain "papandayan" not found. Please ensure MountainSeeder runs first.');
        }
    }
}