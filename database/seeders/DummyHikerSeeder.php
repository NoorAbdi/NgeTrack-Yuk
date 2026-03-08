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

        $this->command->info('Memulai pembuatan 100 Dummy Data Pendaki...');

        $mountain = Mountain::firstOrCreate(
            ['name' => 'Gunung Papandayan'],
            [
                'slug' => 'gunung-papandayan', 
                'status' => 'open', 
            ]
        );

        $checkpoints = [];
        $checkpointNames = ['Basecamp', 'Pos 1 - Gerbang', 'Pos 2 - Kawah', 'Pondok Saladah', 'Hutan Mati'];
        foreach ($checkpointNames as $index => $name) {
            $checkpoints[] = Checkpoint::firstOrCreate(
                ['mountain_id' => $mountain->id, 'name' => $name],
                ['slug' => Str::slug('Papandayan ' . $name), 'order' => $index]
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
                $hoursAgo = $faker->randomElement([
                    $faker->numberBetween(1, 4),   // NORMAL
                    $faker->numberBetween(6, 9),   // WARNING 
                    $faker->numberBetween(11, 24)  // CRITICAL
                ]);
                $createdAt = Carbon::now()->subHours($hoursAgo);
                
                $plannedDescent = Carbon::now()->addDays($faker->numberBetween(0, 2))->setHour(14); 
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

        $this->command->info('Berhasil! 100 data pendaki dummy telah ditambahkan.');
    }
}