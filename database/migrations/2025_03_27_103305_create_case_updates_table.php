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
        Schema::create('case_updates', function (Blueprint $table) {
            $table->id();

            // Use ->nullable() and check constraint existence
            $table->unsignedBigInteger('case_id')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->text('update_notes');
            $table->timestamps();
            $table->softDeletes();

            // Add foreign key constraints separately
            $table->foreign('case_id')
                ->references('id')
                ->on('cases')
                ->onDelete('cascade');

            $table->foreign('updated_by')
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
        // Drop foreign key constraints first
        Schema::table('case_updates', function (Blueprint $table) {
            $table->dropForeignIfExists(['case_id']);
            $table->dropForeignIfExists(['updated_by']);
        });

        Schema::dropIfExists('case_updates');    }
};
