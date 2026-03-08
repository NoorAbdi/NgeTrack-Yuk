<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hikes', function (Blueprint $table) {
            $table->timestamp('last_alert_sent_at')->nullable()->after('admin_notes');
        });
    }

    public function down(): void
    {
        Schema::table('hikes', function (Blueprint $table) {
            $table->dropColumn('last_alert_sent_at');
        });
    }
};
