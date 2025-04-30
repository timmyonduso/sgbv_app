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
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            // Use unsignedBigInteger for foreign keys
            $table->unsignedBigInteger('incident_id')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->unsignedBigInteger('status_id')->nullable();

            $table->text('resolution_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Add foreign key constraints separately
            $table->foreign('incident_id')
                ->references('id')
                ->on('incidents')
                ->onDelete('cascade');

            $table->foreign('assigned_to')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->foreign('status_id')
                ->references('id')
                ->on('statuses')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cases', function (Blueprint $table) {
            $table->dropForeignIfExists(['incident_id']);
            $table->dropForeignIfExists(['assigned_to']);
            $table->dropForeignIfExists(['status_id']);
        });
        Schema::dropIfExists('cases');
    }
};
