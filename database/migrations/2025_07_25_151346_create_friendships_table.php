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
        Schema::create('friendships', function (Blueprint $table) {
            $table->id();
            $table->ulid('requester_id')->constrained('users')->cascadeOnDelete();
            $table->ulid('addressee_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status',['pending','accepted','blocked'])->default('pending');
            $table->unique(['requester_id', 'addressee_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('friendships');
    }
};
