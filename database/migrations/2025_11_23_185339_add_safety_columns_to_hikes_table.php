<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hikes', function (Blueprint $table) {
            // Untuk menyimpan persetujuan syarat & ketentuan (Input Fig 5)
            $table->timestamp('terms_accepted_at')->nullable()->after('status');
            
            // Untuk Admin mencatat masalah/insiden (Output Fig 3 - problematic cases)
            $table->text('admin_notes')->nullable()->after('completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('hikes', function (Blueprint $table) {
            $table->dropColumn(['terms_accepted_at', 'admin_notes']);
        });
    }
};