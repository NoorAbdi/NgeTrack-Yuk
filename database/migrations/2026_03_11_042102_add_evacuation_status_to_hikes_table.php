<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('hikes', function (Blueprint $table) {
            $table->string('evacuation_status')->nullable()->after('status');
        });
    }

    public function down()
    {
        Schema::table('hikes', function (Blueprint $table) {
            $table->dropColumn('evacuation_status');
        });
    }
};
