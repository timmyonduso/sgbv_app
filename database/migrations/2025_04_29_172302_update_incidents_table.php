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
        Schema::table('incidents', function (Blueprint $table) {
            // Make survivor_id nullable to allow anonymous reports
            $table->unsignedBigInteger('survivor_id')->nullable()->change();

            // Add tracking code for anonymous reports
            $table->string('tracking_code')->nullable()->unique();

            // Add optional contact info field for anonymous reports
            $table->text('contact_info')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            // Set survivor_id back to required
            $table->unsignedBigInteger('survivor_id')->nullable(false)->change();

            // Remove tracking code column
            $table->dropColumn('tracking_code');

            // Remove contact info column
            $table->dropColumn('contact_info');
        });
    }
};
