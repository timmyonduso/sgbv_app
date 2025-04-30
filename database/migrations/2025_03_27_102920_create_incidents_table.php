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
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            // Use unsignedBigInteger for foreign keys
            $table->unsignedBigInteger('survivor_id')->nullable();
            $table->unsignedBigInteger('status_id')->nullable();

            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Add foreign key constraints separately
            $table->foreign('survivor_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

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
        Schema::table('incidents', function (Blueprint $table) {
            $table->dropForeignIfExists(['survivor_id']);
            $table->dropForeignIfExists(['status_id']);
        });
        Schema::dropIfExists('incidents');
    }
};
