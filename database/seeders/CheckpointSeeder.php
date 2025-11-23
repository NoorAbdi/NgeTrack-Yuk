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
                ['name' => 'Pos 1: Gerbang utama', 'slug' => 'papandayan-pos-1-gerbang-utama', 'order' => 0],
                ['name' => 'Pos 2: Parkir kendaraan', 'slug' => 'papandayan-pos-2-parkir', 'order' => 1],
                ['name' => 'Pos 3: Pos keamanan (melapor)', 'slug' => 'papandayan-pos-3-keamanan', 'order' => 2],
                ['name' => 'Pos 4: Awal gerbang pendakian', 'slug' => 'papandayan-pos-4-gerbang-pendakian', 'order' => 3],
                ['name' => 'Pos 5: Ujung Jalan Aspal', 'slug' => 'papandayan-pos-5-ujung-aspal', 'order' => 4],
                ['name' => 'Pos 6: Area kawah', 'slug' => 'papandayan-pos-6-kawah', 'order' => 5],
                ['name' => 'Pos 7: Persimpangan (Hutan Mati/Ghober Hoet)', 'slug' => 'papandayan-pos-7-persimpangan', 'order' => 6],
                ['name' => 'Pos 8: Ghober Hoet (Jalur A)', 'slug' => 'papandayan-pos-8-ghober-hoet', 'order' => 7],
                ['name' => 'Pos 9: Hutan Mati (Jalur B)', 'slug' => 'papandayan-pos-9-hutan-mati', 'order' => 7],
                ['name' => 'Pos 10: Pondok Saladah', 'slug' => 'papandayan-pos-10-pondok-saladah', 'order' => 8],
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
            $this->command->warn('Gunung "papandayan" tidak ditemukan. Pastikan MountainSeeder sudah berjalan.');
        }
    }
}