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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            // Use unsignedBigInteger for foreign keys
            $table->unsignedBigInteger('generated_by')->nullable();

            $table->enum('report_type', [
                'Incident Summary',
                'Case Progress',
                'Legal Status'
            ])->nullable();

            $table->json('report_data')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Add foreign key constraints separately
            $table->foreign('generated_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropForeignIfExists(['generated_by']);
        });
        Schema::dropIfExists('reports');
    }
};
