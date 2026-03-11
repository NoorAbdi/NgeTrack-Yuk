<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hikes', function (Blueprint $table) {
            $table->dateTime('planned_ascent_date')->change();
            $table->dateTime('planned_descent_date')->change();
        });
    }

    public function down(): void
    {
        Schema::table('hikes', function (Blueprint $table) {
            $table->date('planned_ascent_date')->change();
            $table->date('planned_descent_date')->change();
        });
    }
};