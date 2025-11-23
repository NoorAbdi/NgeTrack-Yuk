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
        // 1. Menambahkan data kontak & darurat ke tabel 'users'
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number')->nullable()->after('email'); // Kontak Pendaki
            $table->string('emergency_contact_name')->nullable()->after('phone_number'); // Nama Kontak Darurat
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name'); // No HP Kontak Darurat
            $table->text('address')->nullable()->after('emergency_contact_phone'); // Alamat (Opsional, tapi bagus untuk data personal)
        });

        // 2. Menambahkan detail jalur ke tabel 'mountains'
        Schema::table('mountains', function (Blueprint $table) {
            $table->enum('difficulty_level', ['easy', 'moderate', 'hard', 'expert'])->default('moderate')->after('location');
            $table->enum('status', ['open', 'closed', 'maintenance'])->default('open')->after('difficulty_level');
            $table->integer('elevation')->nullable()->after('location'); // Ketinggian (mdpl) - Opsional tapi relevan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone_number', 'emergency_contact_name', 'emergency_contact_phone', 'address']);
        });

        Schema::table('mountains', function (Blueprint $table) {
            $table->dropColumn(['difficulty_level', 'status', 'elevation']);
        });
    }
};