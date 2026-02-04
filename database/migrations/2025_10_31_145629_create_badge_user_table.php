<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('badge_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('badge_id')->constrained()->onDelete('cascade');
            $table->foreignId('hike_id')->nullable()->constrained()->onDelete('set null'); // Optional: This badge is earned from which hiking.
            $table->timestamp('unlocked_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamps();
            $table->unique(['user_id', 'badge_id']); // Ensure that 1 user can only get 1 of the same badge
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('badge_user');
    }
};
