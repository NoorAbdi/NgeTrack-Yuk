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

        $this->command->info('Starting the creation of 100 Dummy Hiker Data...');

        $mountain = Mountain::firstOrCreate(
            ['name' => 'Gunung Papandayan'],
            [
                'slug' => 'gunung-papandayan', 
                'status' => 'open', 
            ]
        );

        $checkpoints = [];
        $checkpointNames = [
            'Pos 1 - Main Gate', 
            'Pos 2 - Parking', 
            'Pos 3 - Security', 
            'Pos 4 - Trailhead', 
            'Pos 5 - Asphalt End', 
            'Pos 6 - Crater', 
            'Pos 7 - Junction', 
            'Pos 8 - Ghober Hoet', 
            'Pos 9 - Dead Forest', 
            'Pos 10 - Pondok Saladah'
        ];
        foreach ($checkpointNames as $index => $name) {
            $checkpoints[] = Checkpoint::firstOrCreate(
                ['mountain_id' => $mountain->id, 'name' => $name],
                ['slug' => Str::slug('Papandayan ' . $name), 'order' => $index + 1]
            );
        }

        for ($i = 0; $i < 100; $i++) {
            $isActive = $i < 70;

            $user = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'phone_number' => $faker->phoneNumber,
                'emergency_contact_name' => $faker->name,
                'emergency_contact_phone' => $faker->phoneNumber,
                'password' => Hash::make('password'),
                'role' => 'hiker',
                'email_verified_at' => now(),
            ]);

            if ($isActive) {
                $statusScenario = $faker->randomElement(['normal', 'normal', 'warning', 'critical']); 

                if ($statusScenario === 'normal') {
                    $plannedDescent = Carbon::now()->addHours($faker->numberBetween(5, 48));
                    $createdAt = Carbon::now()->subHours($faker->numberBetween(1, 10));
                } elseif ($statusScenario === 'warning') {
                    $plannedDescent = Carbon::now()->addMinutes($faker->numberBetween(30, 150));
                    $createdAt = Carbon::now()->subHours($faker->numberBetween(5, 12));
                } else {
                    $plannedDescent = Carbon::now()->subHours($faker->numberBetween(1, 12));
                    $createdAt = $plannedDescent->copy()->subHours($faker->numberBetween(10, 48)); 
                }
            } else {
                $createdAt = Carbon::now()->subDays($faker->numberBetween(1, 6));
                $plannedDescent = $createdAt->copy()->addDays(1);
            }

            $hike = Hike::create([
                'user_id' => $user->id,
                'mountain_id' => $mountain->id,
                'hike_registration_id' => 'REG-' . strtoupper(Str::random(8)),
                'status' => $isActive ? 'active' : 'completed',
                'planned_ascent_date' => $createdAt->copy()->startOfDay(),
                'planned_descent_date' => $plannedDescent,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
                'completed_at' => $isActive ? null : $createdAt->copy()->addHours(10),
            ]);

            if ($isActive) {
                $randomCheckpoint = $faker->randomElement($checkpoints);
                
                DB::table('checkpoint_logs')->insert([
                    'hike_id' => $hike->id,
                    'checkpoint_id' => $randomCheckpoint->id,
                    'scanned_at' => $createdAt->copy()->addMinutes($faker->numberBetween(30, 120)),
                ]);
            }
        }

        $this->command->info('Success! 100 dummy hiker data has been added.');
    }
}