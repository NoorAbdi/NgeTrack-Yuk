<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hikes', function (Blueprint $table) {
            $table->id();
            $table->string('hike_registration_id')->unique(); // 'H-20251031-001'
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relationship to the 'users' table
            $table->foreignId('mountain_id')->constrained()->onDelete('cascade'); // Relationship to the table 'mountains'
            $table->enum('status', ['active', 'completed', 'pending'])->default('pending');
            $table->date('planned_ascent_date');
            $table->date('planned_descent_date');
            $table->timestamp('completed_at')->nullable(); // Filled when the climb is finished
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hikes');
    }
};
