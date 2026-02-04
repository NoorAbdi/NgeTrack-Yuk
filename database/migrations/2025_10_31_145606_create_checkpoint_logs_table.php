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
        Schema::create('checkpoint_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hike_id')->constrained()->onDelete('cascade'); //Relation to climbing registration
            $table->foreignId('checkpoint_id')->constrained()->onDelete('cascade'); // Relation to scanned checkpoints
            $table->enum('direction', ['ascent', 'descent']); // 'ascend' or 'descent'
            $table->timestamp('scanned_at')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checkpoint_logs');
    }
};
