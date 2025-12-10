<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mountain; 
use Illuminate\Support\Facades\DB;

class MountainSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('mountains')->delete();
        
        Mountain::create([
            'name' => 'Papandayan Mountain',
            'slug' => 'papandayan',
            'location' => 'Garut, Jawa Barat'
        ]);
    }
}