<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Mountain;
use App\Models\Checkpoint;
use App\Models\Hike;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DummyHikerSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('id_ID');

        $this->command->info('Membangun 100 Data Pendaki yang Dinamis (Ascending, Descending, Completed)...');

        $mountain = Mountain::firstOrCreate(
            ['name' => 'Gunung Papandayan'],
            ['slug' => 'gunung-papandayan', 'status' => 'open']
        );

        $checkpoints = [];
        $checkpointNames = [
            'Pos 1 - Main Gate', 'Pos 2 - Parking', 'Pos 3 - Security', 'Pos 4 - Trailhead', 
            'Pos 5 - Asphalt End', 'Pos 6 - Crater', 'Pos 7 - Junction', 'Pos 8 - Ghober Hoet', 
            'Pos 9 - Dead Forest', 'Pos 10 - Pondok Saladah'
        ];
        
        foreach ($checkpointNames as $index => $name) {
            $checkpoints[$index + 1] = Checkpoint::firstOrCreate(
                ['mountain_id' => $mountain->id, 'name' => $name],
                ['slug' => Str::slug('Papandayan ' . $name), 'order' => $index + 1]
            );
        }

        for ($i = 0; $i < 100; $i++) {
            $hikeState = $faker->randomElement(['ascending', 'descending', 'completed']);
            $isActive = ($hikeState !== 'completed');

            $startTime = $isActive ? Carbon::now()->subHours($faker->numberBetween(1, 10)) : Carbon::now()->subDays($faker->numberBetween(1, 7));

            $user = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'phone_number' => $faker->numerify('08##########'),
                'emergency_contact_name' => $faker->name,
                'emergency_contact_phone' => $faker->numerify('08##########'),
                'password' => Hash::make('password'),
                'role' => 'hiker',
                'email_verified_at' => now(),
            ]);

            $hike = Hike::create([
                'user_id' => $user->id,
                'mountain_id' => $mountain->id,
                'hike_registration_id' => 'REG-' . strtoupper(Str::random(8)),
                'status' => $isActive ? 'active' : 'completed', 
                'planned_ascent_date' => $startTime->copy()->startOfDay(),
                'planned_descent_date' => $startTime->copy()->addDays(2),
                'created_at' => $startTime,
                'updated_at' => $startTime,
                'completed_at' => $isActive ? null : $startTime->copy()->addHours(15),
            ]);

            $scanTime = $startTime->copy();
            
            if ($hikeState === 'ascending') {
                $currentPos = $faker->numberBetween(1, 9);
                for ($pos = 1; $pos <= $currentPos; $pos++) {
                    $scanTime->addMinutes($faker->numberBetween(30, 90));
                    DB::table('checkpoint_logs')->insert([
                        'hike_id' => $hike->id,
                        'checkpoint_id' => $checkpoints[$pos]->id,
                        'scanned_at' => $scanTime->copy(),
                    ]);
                }
            } 
            elseif ($hikeState === 'descending') {
                for ($pos = 1; $pos <= 10; $pos++) {
                    $scanTime->addMinutes($faker->numberBetween(30, 90));
                    DB::table('checkpoint_logs')->insert([
                        'hike_id' => $hike->id,
                        'checkpoint_id' => $checkpoints[$pos]->id,
                        'scanned_at' => $scanTime->copy(),
                    ]);
                }

                $currentPos = $faker->numberBetween(2, 9);
                for ($pos = 9; $pos >= $currentPos; $pos--) {
                    $scanTime->addMinutes($faker->numberBetween(20, 60));
                    DB::table('checkpoint_logs')->insert([
                        'hike_id' => $hike->id,
                        'checkpoint_id' => $checkpoints[$pos]->id,
                        'scanned_at' => $scanTime->copy(),
                    ]);
                }
            } 
            elseif ($hikeState === 'completed') {
                for ($pos = 1; $pos <= 10; $pos++) {
                    $scanTime->addMinutes($faker->numberBetween(30, 90));
                    DB::table('checkpoint_logs')->insert([
                        'hike_id' => $hike->id,
                        'checkpoint_id' => $checkpoints[$pos]->id,
                        'scanned_at' => $scanTime->copy(),
                    ]);
                }
                for ($pos = 9; $pos >= 1; $pos--) {
                    $scanTime->addMinutes($faker->numberBetween(20, 60));
                    DB::table('checkpoint_logs')->insert([
                        'hike_id' => $hike->id,
                        'checkpoint_id' => $checkpoints[$pos]->id,
                        'scanned_at' => $scanTime->copy(),
                    ]);
                }
            }
        }

        $this->command->info('Completed!');
    }
}